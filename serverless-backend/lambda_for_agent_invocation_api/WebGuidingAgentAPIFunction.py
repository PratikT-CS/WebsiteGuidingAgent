import json
import boto3
import base64
import os
import logging
import re

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock AgentCore client once (outside handler for efficiency)
client = boto3.client('bedrock-agentcore')
agent_arn = os.environ['AGENT_ARN']

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        query = body.get('query')
        client_id = body.get('client_id', 'default-client')
        location = body.get('location', '')

        if not query:
            return {
                'statusCode': 400,
                'body': json.dumps({'content': 'Missing query in request body'})
            }

        # Generate a lightweight session ID
        session_id = f"{client_id}_session_id"

        # Build prompt
        prompt = f"User's query: {query}. Location: {location}"
        payload = json.dumps({'prompt': prompt, 'client_id': client_id}).encode('utf-8')

        # Invoke Bedrock AgentCore runtime
        response = client.invoke_agent_runtime(
            agentRuntimeArn=agent_arn,
            runtimeSessionId=session_id,
            payload=payload
        )
        
        raw_result = response['response'].read().decode('utf-8').strip()
        parsed = json.loads(raw_result)

        # Extract the text content
        text_content = parsed.get("result", {}).get("content", [{}])[0].get("text", "")

        # Remove <thinking>...</thinking> parts and extra newlines
        clean_content = re.sub(r"<thinking>.*?</thinking>", "", text_content, flags=re.DOTALL).strip()

        # Return only the final response in "content"
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'content': clean_content})
        }

    except Exception as e:
        logger.exception(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'content': 'Internal server error'})
        }
