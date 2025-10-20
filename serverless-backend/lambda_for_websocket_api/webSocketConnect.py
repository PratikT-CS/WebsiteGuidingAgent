import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['CONNECTION_TABLE'])

def lambda_handler(event, context):
    """
    Handles WebSocket connection - stores AWS-generated connectionId 
    mapped to client's custom client_id
    """
    # AWS automatically generates this connectionId
    connection_id = event['requestContext']['connectionId']
    
    # Extract client_id from query parameters
    query_params = event.get('queryStringParameters') or {}
    client_id = query_params.get('client_id')
    
    # Validate client_id is provided
    if not client_id:
        print("Error: client_id is required")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'client_id query parameter is required'})
        }
    
    try:
        # Store the mapping in DynamoDB
        item = {
            'connectionId': connection_id,  # Primary key (AWS-generated)
            'clientId': client_id,           # Your custom identifier
            'connectedAt': datetime.utcnow().isoformat()
        }
        print(f"Storing item: {item}")
        table.put_item(Item=item)
        
        print(f"Connection established: clientId={client_id}, connectionId={connection_id}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Connected successfully'})
        }
        
    except Exception as e:
        print(f"Error storing connection: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to establish connection'})
        }
