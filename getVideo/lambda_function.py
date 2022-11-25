import json
import boto3
import uuid

dynamoDB = boto3.resource('dynamodb')
table = dynamoDB.Table('tours')

def lambda_handler(event, context):
    path = event['path']
    print(event)
    #GET (search) API endpoint
    if (path == '/tours/search'):
        #getting request query parameters
        tname = event['queryStringParameters']['tourName']
        loc = event['queryStringParameters']['location']
        #scanning using the parameters, retrieves all matches
        # '#' is used before attribute names placeholders, ':' is used for value placeholders
        data = table.scan(
            FilterExpression='begins_with (#location, :locValue) and begins_with ( #tourName , :tnameValue )',
            ExpressionAttributeValues={ ':locValue' : loc , ':tnameValue' : tname },
            ExpressionAttributeNames={ '#location': 'location' , '#tourName' :'tourName' }
        )
        #response sent back to the client
        response = {
            'statusCode': int(data['ResponseMetadata']['HTTPStatusCode']),
            'body': json.dumps(str(data['Items']))
        }
        
    #GET (by id) API endpoint
    elif (path == '/tours/id'):
        #retrieving request id parameter
        id = str(event['queryStringParameters']['id'])
        #searching for a SINGLE matching item
        data = table.get_item(
            Key = {'id' : id }
        )
        #response sent back to the client
        response = {
            'statusCode': int(data['ResponseMetadata']['HTTPStatusCode']),
            'body': json.dumps(str(data['Item']))
        }
        
    #POST (for video info) API endpoint
    #upgrade to add later: check for duplicates before inserting, return error message if one is found
    elif (path == '/tours/upload'):
        #retrieving request data, converting from JSON to a python dictionary
        reqData = json.loads(event['body'])
        #UUID used to make a unique primary key id
        keyDict = {'id' : str(uuid.uuid4())} 
        reqData.update(keyDict)
        
        #adding the item to the table
        table.put_item(Item = reqData)
        #response sent back to the client
        response = {
            'statusCode' : 200,
            'body' : 'Your video has been uploaded!'
        }
        
    elif (path == '/tours/update'):
        #retrieving request data, converting from JSON to a python dictionary
        reqData = json.loads(event['body'])
        #separating the id key into a separate dictionary for the put_item function later
        key = {"id": str(reqData["id"])} #right key format
        #removing it from dictionary for consistency
        reqData.pop('id')
        #making a new dictionary with tuples holding attributes and values
        items = reqData.items()
        #put_item parameters initialized and filled in the FOR loop
        expStr = 'SET '
        attributeValues = {}
        attributeNames = {}
        i = 1
        for item in items:
            if (i > 1):
                expStr += " , "
            expStr += '#name'+str(i) + ' = ' + ':value'+str(i)
            attributeNames.update({'#name'+str(i) : item[0]})
            attributeValues.update({':value'+str(i) : item[1]})
            i += 1
        
        print(expStr)    
        print(attributeValues)
        print(attributeNames)
        
        
        #updates the item with corresponding key using the given attributes. Can add parameters to return the modified item.
        table.update_item(Key = key,
            UpdateExpression = expStr,
            ExpressionAttributeValues = attributeValues,
            ExpressionAttributeNames = attributeNames
        )
        #response sent back to the client
        response = {
            'statusCode' : 200,
            'body' : 'Your video has been updated!'
        }
        
    #DELETE (by id) API endpoint
    elif (path == '/tours/delete'):
        #retrieving request id parameter
        id = str(event['queryStringParameters']['id'])
        #searching for a SINGLE matching item
        table.delete_item(
            Key = {'id' : id }
        )
        #response sent back to the client. Can add a retrieval for the item before deleting, and return here (like a pop())
        response = {
            'statusCode': 200,
            'body': json.dumps('Item deleted for id='+id)
        }
        
    return response
    