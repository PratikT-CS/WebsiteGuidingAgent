## WebGuidingAgentAPIFunction (AWS Lambda)

This Lambda exposes a lightweight HTTP endpoint that forwards user queries to an Amazon Bedrock Agent Runtime and returns only the final cleaned response text.

### Handler

- File: `WebGuidingAgentAPIFunction.py`
- Handler: `WebGuidingAgentAPIFunction.lambda_handler`
- Runtime: Python 3.11+ (or 3.10/3.9; the code is compatible)

### Environment variables

- `AGENT_ARN` (required): The ARN of the Bedrock Agent (runtime ARN) to invoke.

### AWS permissions (IAM policy)

Attach an execution role to the Lambda with at least the following policies:

1. CloudWatch Logs (basic Lambda logging)

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

2.  Bedrock Agent Runtime invoke permissions

Note: The code uses the Bedrock Agent Runtime (AgentCore) client to call the agent. Depending on your AWS partition/region and latest service naming, one or more of the following IAM actions may be required. Scope to your specific resources when possible.

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
         "arn:aws:bedrock:*:<account-id>:agent/*",
         "arn:aws:bedrock:*:<account-id>:agent-alias/*",
         "arn:aws:bedrock:*:<account-id>:agent-runtime/*"
       ]
     }
   ]
 }

 If you are certain which interface you use (e.g., an Agent Alias ARN vs. an Agent Runtime ARN), you can drop the unused actions and resources to follow least-privilege.
```

If your environment uses KMS to encrypt environment variables or logs, also include the necessary `kms:Decrypt` permissions restricted to the relevant CMK.

### Optional permissions (only if used)

- VPC networking (only if Lambda is placed in a VPC)
  - `ec2:CreateNetworkInterface`, `ec2:DescribeNetworkInterfaces`, `ec2:DeleteNetworkInterface` scoped to the Lambda service role.
- AWS X-Ray tracing
  - `xray:PutTraceSegments`, `xray:PutTelemetryRecords`.

### Network and regional considerations

- Ensure the Lambda is deployed in the same AWS Region as your Bedrock Agent Runtime, or that cross-region calls are allowed/supported in your setup.
- If the Lambda is in a VPC, verify egress access (NAT or VPC endpoint) to reach the Bedrock Agent Runtime.

### Deployment steps (high-level)

1. Create an execution role for the Lambda and attach:
   - AWS managed policy: `AWSLambdaBasicExecutionRole` (or custom equivalent for logs).
   - A custom inline policy granting `bedrock:InvokeAgent` to your Agent/Agent Alias ARNs.
2. Create the Lambda function:
   - Runtime: Python 3.11+
   - Handler: `WebGuidingAgentAPIFunction.lambda_handler`
   - Code: contents of this directory
   - Environment variables: set `AGENT_ARN` to your Agent Runtime ARN
3. (Optional) Enable X-Ray tracing and/or place into a VPC if required.

### Exposing via API Gateway

Use Amazon API Gateway (HTTP API or REST API) with Lambda proxy integration.

- CORS: The function sets `Access-Control-Allow-Origin: *` in the response. Configure API Gateway CORS to match your frontend’s origin policy as needed.
- Method: `POST /agent-invocation`
- Integration: Lambda proxy

Recommended setup (HTTP API):

1. Create an HTTP API in API Gateway.
2. Create a route: `POST /agent-invocation`.
3. Create an integration for the route: type "Lambda", integration subtype "Lambda proxy", target this function.
4. Enable CORS on the API/route if your frontend is browser-based.
5. Deploy the API to a stage (e.g., `prod`).

Lambda resource-based permission for API Gateway:

Grant API Gateway permission to invoke the Lambda using either the console or CLI. Example CLI (replace placeholders):

```
aws lambda add-permission \
  --function-name <lambda-name-or-arn> \
  --statement-id apigw-invoke-agent-invocation \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:<region>:<account-id>:<api-id>/*/POST/agent-invocation
```

If you use a REST API instead of HTTP API, the `source-arn` will be similar but includes the stage and method pattern for REST APIs.

Example request body (JSON):

```json
{
  "query": "How do I navigate to the pricing page?",
  "client_id": "web-123",
  "location": "/home"
}
```

Example response body (JSON):

```json
{
  "content": "Click Pricing in the top navigation to view plans."
}
```

### Error handling

- 400 when `query` is missing in the request body.
- 500 for unexpected errors (logged to CloudWatch Logs).

### Security notes

- Validate and sanitize any additional fields you introduce to the request body.
- Restrict `bedrock:InvokeAgent` to the specific `AGENT_ARN` your function needs.
- If exposing publicly, enforce authentication/authorization at API Gateway (JWT authorizer, Lambda authorizer) or via a private API and a trusted frontend.

### Local testing

You can test the handler locally using a simple payload:

```python
from WebGuidingAgentAPIFunction import lambda_handler

event = {
    "body": "{\"query\": \"hello\", \"client_id\": \"local\", \"location\": \"/\"}"
}

print(lambda_handler(event, None))
```

Note: Local tests will attempt to call AWS Bedrock. Provide AWS credentials and region via your environment (e.g., `AWS_PROFILE`, `AWS_REGION`).

### Dependencies

- Uses `boto3`, which is available in the AWS Lambda Python runtime. No external layers are required.
