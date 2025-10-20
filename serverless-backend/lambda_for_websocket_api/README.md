## WebSocket Connection Lambdas (API Gateway WebSocket)

These Lambdas back an API Gateway WebSocket API to track connections in DynamoDB.

Functions:

- `webSocketConnect.lambda_handler`: Handles `$connect`, stores `connectionId` mapped to client-provided `client_id`.
- `webSocketDisconnect.lambda_handler`: Handles `$disconnect`, removes the `connectionId` record.

### Handler

- Files: `webSocketConnect.py`, `webSocketDisconnect.py`
- Handlers: `webSocketConnect.lambda_handler`, `webSocketDisconnect.lambda_handler`
- Runtime: Python 3.11+ (or 3.10/3.9)

### Environment variables

- `CONNECTION_TABLE` (required): DynamoDB table name. Use `webSocketConnections` by default.

### DynamoDB table

- Table name: `webSocketConnections`
- Primary key: `connectionId` (String)
- Example item written on connect:

```json
{
  "connectionId": "abc123=",
  "clientId": "web-123",
  "connectedAt": "2025-10-20T10:00:00.000000"
}
```

### Required IAM permissions (execution role)

Attach an execution role with the following permissions. Replace `*` with least-privilege scoping as desired (specific table ARN, specific API ID/stage, etc.).

1. CloudWatch Logs

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

2. DynamoDB + API Gateway WebSocket

Provided baseline policy (as requested):

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

Least-privilege recommendations:

- Scope DynamoDB actions to the table ARN: `arn:aws:dynamodb:<region>:<account-id>:table/webSocketConnections`
- Scope `execute-api:*` to your WebSocket API execute-api ARN: `arn:aws:execute-api:<region>:<account-id>:<api-id>/<stage>/POST/@connections/*`

### API Gateway WebSocket setup

1. Create a WebSocket API in API Gateway.
2. Routes:
   - `$connect` → Integration: Lambda proxy → `webSocketConnect`
   - `$disconnect` → Integration: Lambda proxy → `webSocketDisconnect`
   - (Optional) `$default` if you need to handle messages; not required for connect/disconnect tracking only.
3. Enable Route Selection Expression as needed (default `$request.body.action` is fine if you add message routes later).
4. Deploy the API to a stage (e.g., `development`).

### Lambda permissions for API Gateway invocation

Add a resource-based policy on each Lambda so API Gateway can invoke it. Example CLI (replace placeholders):

```
aws lambda add-permission \
  --function-name <connect-lambda-name-or-arn> \
  --statement-id apigw-invoke-connect \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:<region>:<account-id>:<api-id>/*/$connect

aws lambda add-permission \
  --function-name <disconnect-lambda-name-or-arn> \
  --statement-id apigw-invoke-disconnect \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:<region>:<account-id>:<api-id>/*/$disconnect
```

For a `$default` route (if added):

```
aws lambda add-permission \
  --function-name <default-lambda-name-or-arn> \
  --statement-id apigw-invoke-default \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:<region>:<account-id>:<api-id>/*/$default
```

### CORS and security notes

- WebSocket APIs do not use CORS like HTTP APIs. Browser origin policy constraints differ for WebSockets.
- Lock down IAM permissions per least-privilege recommendations above.
- Consider auth on `$connect` (e.g., IAM/Custom Authorizer) if needed.

### Local testing

- Unit test handlers by simulating events with `requestContext.connectionId` and query string params:

```python
from webSocketConnect import lambda_handler as on_connect
from webSocketDisconnect import lambda_handler as on_disconnect

connect_event = {
  "requestContext": {"connectionId": "abc123"},
  "queryStringParameters": {"client_id": "web-123"}
}
print(on_connect(connect_event, None))

disconnect_event = {"requestContext": {"connectionId": "abc123"}}
print(on_disconnect(disconnect_event, None))
```

### Dependencies

- Uses `boto3` available in the Lambda Python runtime. No external layers required.
