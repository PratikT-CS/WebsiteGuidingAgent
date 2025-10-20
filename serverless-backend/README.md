## Website Guiding Agent – Serverless Backend

This backend powers the Website Guiding Agent with:

- An HTTP API to invoke the Bedrock AgentCore runtime via a Lambda
- A WebSocket API for real-time messages, with connections tracked in DynamoDB

Architecture:

![Architecture](../Website%20Guiding%20Agent%20Architecture.jpeg)

### Components

- Agent Invocation HTTP API

  - API Gateway HTTP API → `lambda_for_agent_invocation_api/WebGuidingAgentAPIFunction.py`
  - Invokes Bedrock AgentCore Runtime for the configured Agent/Agent Alias

- WebSocket API (real-time)

  - API Gateway WebSocket API → `$connect` and `$disconnect` routes
  - `lambda_for_websocket_api/webSocketConnect.py`
  - `lambda_for_websocket_api/webSocketDisconnect.py`
  - Stores and deletes connection records in DynamoDB

- DynamoDB
  - Table: `webSocketConnections`
  - Primary (partition) key: `connectionId` (String)
  - Global Secondary Index (GSI): `clientId-index` with partition key `clientId` (String)

### Create DynamoDB table (CLI)

```bash
aws dynamodb create-table \
  --table-name webSocketConnections \
  --attribute-definitions AttributeName=connectionId,AttributeType=S AttributeName=clientId,AttributeType=S \
  --key-schema AttributeName=connectionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    IndexName=clientId-index,KeySchema=[{AttributeName=clientId,KeyType=HASH}],Projection={ProjectionType=ALL}
```

Verify:

```bash
aws dynamodb describe-table --table-name webSocketConnections
```

### Lambda functions and environment variables

- Agent Invocation Lambda

  - File: `lambda_for_agent_invocation_api/WebGuidingAgentAPIFunction.py`
  - Handler: `WebGuidingAgentAPIFunction.lambda_handler`
  - Env vars:
    - `AGENT_ARN`: Bedrock Agent/Agent Alias/Agent Runtime ARN

- WebSocket Lambdas
  - Files: `lambda_for_websocket_api/webSocketConnect.py`, `lambda_for_websocket_api/webSocketDisconnect.py`
  - Handlers: `webSocketConnect.lambda_handler`, `webSocketDisconnect.lambda_handler`
  - Env vars:
    - `CONNECTION_TABLE`: `webSocketConnections`

### Required IAM permissions

Attach these to each Lambda execution role (scope resources to least-privilege in your environment):

- CloudWatch Logs (all Lambdas)

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

- Bedrock AgentCore Runtime (Agent Invocation Lambda)

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:InvokeAgentAlias",
        "bedrock:InvokeAgentRuntime"
      ],
      "Resource": [
        "arn:aws:bedrock:<region>:<account-id>:agent/<agent-id>",
        "arn:aws:bedrock:<region>:<account-id>:agent-alias/<agent-id>/*",
        "arn:aws:bedrock:<region>:<account-id>:agent-runtime/<runtime-id>"
      ]
    }
  ]
}
```

- DynamoDB + API Gateway (WebSocket Lambdas)

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:<region>:<account-id>:table/webSocketConnections",
        "arn:aws:dynamodb:<region>:<account-id>:table/webSocketConnections/index/clientId-index"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke",
        "execute-api:ManageConnections"
      ],
      "Resource": "arn:aws:execute-api:<region>:<account-id>:<ws-api-id>/<stage>/POST/@connections/*"
    }
  ]
}
```

If using KMS for encryption, add `kms:Decrypt` restricted to the CMK.

### API Gateway configuration

- HTTP API (Agent Invocation)

  - Route: `POST /agent-invocation`
  - Integration: Lambda proxy → Agent Invocation Lambda
  - Lambda permission:
    ```bash
    aws lambda add-permission \
      --function-name <agent-invocation-lambda> \
      --statement-id apigw-invoke-agent-invocation \
      --action lambda:InvokeFunction \
      --principal apigateway.amazonaws.com \
      --source-arn arn:aws:execute-api:<region>:<account-id>:<http-api-id>/*/POST/agent-invocation
    ```

- WebSocket API (Real-time)

  - Routes → Lambdas:
    - `$connect` → `webSocketConnect`
    - `$disconnect` → `webSocketDisconnect`
  - Lambda permissions:

    ```bash
    aws lambda add-permission \
      --function-name <connect-lambda> \
      --statement-id apigw-invoke-connect \
      --action lambda:InvokeFunction \
      --principal apigateway.amazonaws.com \
      --source-arn arn:aws:execute-api:<region>:<account-id>:<ws-api-id>/*/$connect

    aws lambda add-permission \
      --function-name <disconnect-lambda> \
      --statement-id apigw-invoke-disconnect \
      --action lambda:InvokeFunction \
      --principal apigateway.amazonaws.com \
      --source-arn arn:aws:execute-api:<region>:<account-id>:<ws-api-id>/*/$disconnect
    ```

### Request/response shapes

- HTTP API request body (example):

```json
{
  "query": "How do I navigate to the pricing page?",
  "client_id": "web-123",
  "location": "/home"
}
```

- HTTP API response body (example):

```json
{ "content": "Click Pricing in the top navigation to view plans." }
```

### Deployment checklist

1. Create DynamoDB table `webSocketConnections` with `clientId-index`.
2. Deploy Lambdas and set env vars (`AGENT_ARN`, `CONNECTION_TABLE`).
3. Attach IAM policies per sections above (least-privilege).
4. Create API Gateway HTTP API and WebSocket API; wire routes and integrations.
5. Grant API Gateway invoke permissions to Lambdas.
6. Configure CORS on the HTTP API as needed.
7. Test end-to-end using the sample payloads.

### Troubleshooting

- 400 from HTTP API: Missing `query` in body.
- 4XX on WebSocket connect: Confirm `$connect` integration and Lambda resource policy.
- 5XX: Check CloudWatch Logs for the specific Lambda and verify IAM permissions and env vars.
