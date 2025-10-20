import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['CONNECTION_TABLE'])

def lambda_handler(event, context):
    """
    Handles WebSocket disconnection - removes connectionId from DynamoDB
    """
    # Get the connectionId from the event
    connection_id = event['requestContext']['connectionId']
    
    try:
        # Delete the connection from DynamoDB
        response = table.delete_item(
            Key={'connectionId': connection_id},
            ReturnValues='ALL_OLD'
        )
        
        # Log the disconnection
        deleted_item = response.get('Attributes', {})
        client_id = deleted_item.get('clientId', 'unknown')
        
        print(f"Connection removed: clientId={client_id}, connectionId={connection_id}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Disconnected successfully'})
        }
        
    except Exception as e:
        print(f"Error removing connection: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to disconnect'})
        }
