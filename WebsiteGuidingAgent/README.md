## WebsiteGuidingAgent (Strands Agent on Bedrock AgentCore)

This repository contains a Strands-based agent that runs on Amazon Bedrock AgentCore. The agent guides users through a sample website and can trigger real-time UI actions in a connected browser via API Gateway WebSocket and DynamoDB connection mapping.

Architecture:

![Architecture](../Website%20Guiding%20Agent%20Architecture.jpeg)

### What this agent does

- Hosts an AgentCore "app" that exposes an HTTP entrypoint for invocations
- Uses a Strands `Agent` with tools to:
  - navigate_to_page
  - scroll_to_section
  - fill_input
  - click_element
  - end_call / pause_call
- Looks up the client WebSocket `connectionId` in DynamoDB by `clientId` and sends realtime messages to the browser through the API Gateway Management API

### Folder contents

- `WebsiteGuidingAgent.py`: AgentCore app, Strands agent, and tools
- `.bedrock_agentcore.yaml`: AgentCore deployment configuration
- `requirements.txt`: Minimal runtime dependencies

### Prerequisites

- Python 3.10+ (3.11 recommended)
- AWS CLI v2 configured (`aws configure`) with your target Region
- Access to the serverless backend components:
  - API Gateway WebSocket API URL and stage
  - DynamoDB table with GSI (see below)
- AgentCore starter toolkit installed in your virtual environment

Install the toolkit and deps:

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install "bedrock-agentcore-starter-toolkit>=0.1.21" strands-agents boto3
```

### Backend dependencies to provision first

1. DynamoDB table (used by the agent to map `clientId` → `connectionId`):

   - Table name: `webSocketConnections` (or align with your table)
   - Partition key: `connectionId` (String)
   - GSI: `clientId-index` with partition key `clientId` (String)

2. WebSocket API Gateway endpoint (Management API base URL):

   - Copy the deployed WebSocket API URL with stage, e.g. `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/`

3. Ensure the connect/disconnect Lambdas populate and remove records in the DynamoDB table as described in `serverless-backend/`.

### Local development and testing

1. Create and activate a virtual environment (optional):

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure runtime values. The sample code reads constants directly; update these in `WebsiteGuidingAgent.py` as needed:

   - `websocket_url` → your WebSocket API endpoint with stage suffix
   - DynamoDB table name used in the code: `WebSocketConnections` (uppercase W) → align to your actual table name `webSocketConnections` or change the code to match
   - Region: `us-east-1` is used in the API Gateway Management API client

4. Run the agent locally:

```bash
python WebsiteGuidingAgent.py
```

By default, `BedrockAgentCoreApp().run()` starts a local HTTP server (AgentCore SDK runtime) exposing the app entrypoint.

5. Invoke locally with a sample payload:

```bash
curl -X POST http://127.0.0.1:8000/invoke \
  -H "Content-Type: application/json" \
  -d '{
        "prompt": "Take me to pricing and click Get Started",
        "client_id": "web-123"
      }'
```

Expected behavior:

- The agent generates a short response
- The tools attempt to send messages to the WebSocket connection for `client_id` via the Management API

### IAM permissions (AgentCore execution role)

The AgentCore execution role (referenced in `.bedrock_agentcore.yaml` under `aws.execution_role`) must allow:

- CloudWatch Logs for the running service (if logs are collected)
- DynamoDB read access for the connections table and GSI:
  - `dynamodb:Query`, `dynamodb:GetItem`, `dynamodb:Scan`
  - Resource scoping (recommended):
    - `arn:aws:dynamodb:<region>:<account-id>:table/webSocketConnections`
    - `arn:aws:dynamodb:<region>:<account-id>:table/webSocketConnections/index/clientId-index`
- API Gateway Management API to send data to clients:
  - `execute-api:ManageConnections`
  - Resource (recommended): `arn:aws:execute-api:<region>:<account-id>:<ws-api-id>/<stage>/POST/@connections/*`

If the agent itself invokes Bedrock model endpoints directly, also include the appropriate Bedrock permissions per your usage.

Attach baseline policy to the AgentCore SDK runtime role:

Add the following statement to the execution role used by AgentCore (e.g., the role referenced in `.bedrock_agentcore.yaml` under `aws.execution_role`). This grants DynamoDB access for connection storage and API Gateway Management API permissions for WebSocket messaging. Scope resources to least-privilege later as needed.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "execute-api:*",
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "execute-api:Invoke",
                "execute-api:ManageConnections"
            ],
            "Resource": "*"
        }
    ]
}
```

### Configure and deploy with AgentCore toolkit

You only need your `WebsiteGuidingAgent.py` and `requirements.txt`. The toolkit generates all configuration for you (no manual YAML edits required).

1. Configure the agent (interactive prompts will create/update resources):

```bash
agentcore configure -e WebsiteGuidingAgent.py
```

During prompts:

- Execution Role: Press Enter to auto-create, or provide your AgentCore SDK runtime role ARN
- Requirements: Confirm `requirements.txt`
- OAuth / Header allowlist: choose no (unless needed)
- Memory: enable long-term memory if desired

2. Launch to AgentCore Runtime:

```bash
agentcore launch
```

This builds and deploys the runtime, provisions memory, and enables observability.

3. Monitor deployment and logs:

```bash
agentcore status
```

Follow the output for GenAI Observability dashboard and log tail commands.

### Invoke and test

- Local HTTP during development (when running `python WebsiteGuidingAgent.py`): see the Local development section above.
- Deployed Runtime (AgentCore):

```bash
agentcore invoke '{"prompt": "Navigate to services and click contact", "client_id": "web-123"}'
```

The agent will respond and attempt to send real-time commands via the WebSocket connection for `client_id`.

### Tips and troubleshooting

- Ensure the DynamoDB table name used by this agent matches the one your WebSocket Lambdas use.
- Verify the WebSocket URL includes the stage suffix, e.g., trailing `/development/`.
- If `post_to_connection` fails with 410 Gone, the connection is stale; remove it from DynamoDB.
- Permission errors when sending to connections indicate missing `execute-api:ManageConnections` on the AgentCore execution role.
- For local runs, the agent still needs AWS credentials to access DynamoDB and the Management API.

### Clean up

```bash
agentcore destroy
```

Removes the AgentCore runtime, memory resources, ECR images, and associated IAM roles (if toolkit-created).
