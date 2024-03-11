import json
import boto3
import uuid

dynamoDB = boto3.resource('dynamodb')
table = dynamoDB.Table('tours')
s3 = boto3.resource('s3')

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
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode': int(data['ResponseMetadata']['HTTPStatusCode']),
            'body': json.dumps(data['Items'])
        }
        
    #GET (by id) API endpoint
    elif (path == '/tours/id'):
        #retrieving request id parameter
        id = str(event['queryStringParameters']['id'])
        print("id: " + id)
        #searching for a SINGLE matching item
        data = table.get_item(
            Key = {'id' : id }
        )
        print(data)
        try:
            print("item found: "+ str(data['Item']))
            body = data['Item']
        except:
            message = {'message': 'item not found.'}
            body = message
        
        #response sent back to the client
        response = {
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode': int(data['ResponseMetadata']['HTTPStatusCode']),
            'body': json.dumps(body)
        }
        print(response)
        
    #POST (for video info) API endpoint
    #upgrade to add later: check for duplicates before inserting, return error message if one is found
    elif (path == '/tours/upload'):
        #retrieving request data, converting from JSON to a python dictionary
        reqData = json.loads(event['body'])
        #UUID used to make a unique primary key id
        keyDict = {'id' : str(uuid.uuid4())} 
        reqData.update(keyDict)
        
        #could add an if-else statement for image maps.
        x = format(reqData.pop('x-coordinate'), ".15g")
        z = format(reqData.pop('z-coordinate'), ".15g")
        reqData.update({"X": x})
        reqData.update({"Z": z})
        
        #for file upload (need to pass a 'key' parameter for file name when posting to s3)
        #possibly check on s3 if the file was uploaded (future code update)
        #also add try/except statements to send meaningful messages / status codes on error for dynamo and s3
        if(reqData.get("key", False)):
            fileKey = str(reqData.pop("key"))
            #checking for duplicates in DynamoDB (S3 automatically discards duplicate attempts)
            duplicateSearch = table.scan(
                FilterExpression='#fileName = :fileValue',
                ExpressionAttributeValues={ ':fileValue' : fileKey},
                ExpressionAttributeNames={ '#fileName': 'fileName'}
            )
            if(duplicateSearch['Count'] > 0): #duplicats found
                message = {'message': 'Error: A tour for this file already exists!'}
                statusCode = 400
            else: #duplicates not found
                tourUrl = {'url' : "https://tourify-tours.s3.amazonaws.com/public/" + fileKey} #Edit: now public directory is needed there after bucket rework
                fileName = {'fileName' : fileKey} #object key is needed for some S3 operations
                reqData.update(tourUrl)
                reqData.update(fileName)
                #adding the item to the table
                table.put_item(Item = reqData)
                message = {'message': 'Your tour has been uploaded!'}
                statusCode = 200
                
        else: #simplify code once s3 is fully deployed on reactjs. right now there are too many branches.
            table.put_item(Item = reqData)
            message = {'message': 'Your tour has been uploaded (without file upload)!'}
            
        #response sent back to the client
        response = {
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode' : statusCode,
            'body' : json.dumps(message)
        }
        
    #update (PUT) API endpoint
    elif (path == '/tours/update'):
        #retrieving request data, converting from JSON to a python dictionary
        reqData = json.loads(event['body'])
        #separating the id key into a separate dictionary for the put_item function later
        key = {"id": str(reqData["id"])} #right key format
        #scan for our item to update. find its file key. run duplicate search.
        if (reqData.get("fileName", False) != False):
            fileKey = str(reqData["fileName"])
            if (fileKey != ""):
                duplicateSearch = table.scan(
                    FilterExpression='#fileName = :fileValue',
                    ExpressionAttributeValues={ ':fileValue' : fileKey},
                    ExpressionAttributeNames={ '#fileName': 'fileName'}
                )
                print(duplicateSearch)
                
                if (duplicateSearch['Count'] > 0): #duplicates found
                    message = {'message': 'Error: A tour already has this file name.'}
                    statusCode = 400
                    #add an elif statement for marker collisions!
                else:
                    #separating the id key into a separate dictionary for the put_item function later
                    #key = {"id": str(reqData["id"])} #right key format
                    #deleting current s3 file (upload needs to be from outside lambda later in frontend because limit is 5mb here)
                    currentRecord = table.get_item(Key = {'id' : key['id']})
                    s3.Object('tourify-tours', 'public/'+currentRecord['Item']['fileName']).delete()
                    reqData.update({'url' : "https://tourify-tours.s3.amazonaws.com/" + str(fileKey)})
                    #removing it from dictionary for consistency
        reqData.pop('id')
        #reqData.update({'url' : "https://tourify-tours.s3.amazonaws.com/" + str(fileKey)})
        
        #if statement for image maps.
        if(reqData.get("x-coordinate", False) != False and reqData.get("z-coordinate", False) != False):
            x = format(reqData.pop('x-coordinate'), ".15g")
            z = format(reqData.pop('z-coordinate'), ".15g")
            reqData.update({"X": x})
            reqData.update({"Z": z})
        
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
        
        #updates the item with corresponding key using the given attributes. Can add parameters to return the modified item.
        table.update_item(Key = key,
            UpdateExpression = expStr,
            ExpressionAttributeValues = attributeValues,
            ExpressionAttributeNames = attributeNames
        )
        
        message = {'message': 'Your tour has been updated!'} #make one for error also based on status code later
        statusCode = 200
        #response sent back to the client
        response = {
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode' : statusCode,
            'body' : json.dumps(message)
        }
        
    #DELETE (by id) API endpoint
    elif (path == '/tours/delete'):
        #retrieving request id parameter
        id = str(event['queryStringParameters']['id'])
        #searching for a SINGLE matching item
        findResult = table.get_item(
            Key = {'id' : id}
        )
        statusCode = 500
        print("find result:" + str(findResult))
        try:
            #throws an exception if 'Item' doesn't exist
            print("item found: "+ str(findResult['Item']))
            #moving on to deletion
            try:
                #deleting record from DynamoDB table
                delResult = table.delete_item(
                    Key = {'id' : id }
                )
                #deleting file from S3
                #print("file name: " + findResult['Item']['fileName']) #debug
                obj = s3.Object('tourify-tours', 'public/'+findResult['Item']['fileName']).delete()
                
                message = {'message': 'Tour id='+id+' has been deleted!'}
                statusCode = findResult['ResponseMetadata']['HTTPStatusCode']
            except:
                message = {"message": "An unexpected error has occured deleting the file."}
        except:
            message = {'message': 'tour not found.'}
            statusCode = 400
        #response sent back to the client. Can add a retrieval for the item before deleting, and return here (like a pop())
        response = {
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode': statusCode,
            'body': json.dumps(message)
        }
        
    return response
    