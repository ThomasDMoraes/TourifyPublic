/** This file is no longer in use. It was a starting point before implementing AWS Amplify and AWS Cognito
*   and before switching from standard JavasScript to the current ReactJS frontend.
*   Currently kept here for future reference. Sensitive AWS Credentials have been removed to make repo public.
**/
//update: signing for POST/PUT

//signature key calculation function -> uses CryptoJS import
//(currently importing in the HTML since javascript can't use node modules. ReactJS can use npm.)
function getSignatureKey(secretKey, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + secretKey);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
}
//signature function
function getSignature(strToSign, signKey) {
    return CryptoJS.HmacSHA256(strToSign, signKey).toString(CryptoJS.enc.Hex);
}


//          ----------- API CALLERS -----------

// adds frontend functionality for Upload page. Sends form data to backend APIs (API Gateway/Lambda)
//GET by ID retrieving the tour record with corresponding ID
document.getElementById("get_id_btn").addEventListener("click", () => {
    console.log("inside button GET ID trigger");
    let id = document.getElementById("get_tid");
    let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id.value;
    console.log("id: ", id.value)
    console.log("url: ", url)

    if (!id.value) {    
        console.log("GET (id) parameters incomplete. Canceling request.");
        window.alert("GET (id) parameters incomplete. Canceling request.");
        return;
    }
    
    fetch(url, 
        {
            method: 'GET'
        })
        .then((response) => response.json().then((data) => {
            console.log("response:", response);
            console.log("data:", data);

            if (data.id) { //match found
                //pop-up string
                str = "ID: " + data.id + "\nTour: " + data.tourName + "\nLocation: " + data.location +
                (data.url ? "\nURL: " + data.url : "") + "\n\n";
                //paragraph string
                str2 = "ID: " + data.id + "<br/>Tour: " + data.tourName + "<br/>Location: " + data.location +
                (data.url ? "<br/>URL: " + data.url : "") + "<br/> <br/>";
                window.alert(str);
                document.getElementById("getId_res").innerHTML = str2;
            }
           else {
                window.alert(data.message)
           }
            
        }))
        .catch((error) => {
            console.log("error:", error);
            window.alert(error);
        })
})

//GET by SEARCH retrieves all matching records beginning with tname and loc
document.getElementById("get_search_btn").addEventListener("click", () => {
    console.log("inside button GET SEARCH trigger");
    let tname = document.getElementById("get_tname");
    let loc = document.getElementById("get_loc");
    let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName="+tname.value+"&location="+loc.value;
    console.log("tname: ", tname.value)
    console.log("loc: ", loc.value)
    console.log("url: ", url)
    
    fetch(url, {method: 'GET'})
        .then((response) => response.json().then((data) => {
            console.log("response:", response);
            console.log("data:", data);
            str = ""; //pop-up string
            str2 = ""; //html paragraph string
            data.forEach(tour => { //use map(props) for ReactJS instead onto a table, grid, or whatever 
                str += "ID: " + tour.id + "\nTour: " + tour.tourName + "\nLocation: " + tour.location +
                (tour.url ? "\nURL: " + tour.url : "") + "\n\n";

                //first character of every line is cut for some reason, so I'm putting a random character there.
                str2 += "aID: " + tour.id + "<br/>aTour: " + tour.tourName + "<br/>aLocation: " + tour.location +
                (tour.url ? "<br/>aURL: " + tour.url : "") + "<br/> <br/>";
            });
            window.alert(str);
            document.getElementById("getSearch_res").innerHTML = str2;
        }))
        .catch((error) => {
            console.log("error:", error);
            window.alert(error);
        })

})


//POST (USING FILE UPLOADS!)
//video uploads are currently untested. the image/ Contenty Type header might need to be changed for it
// (commented out for the demo. Using the older post method)
document.getElementById("post_btn").addEventListener("click", () => {
    console.log("inside button POST trigger");
    //assigning variables from the HTML form
    let bucketUrl = "https://tourify-tours.s3.amazonaws.com/";
    let uploadKey = document.getElementById("pathKey").value;
    let inputFile = document.getElementById("post_file").files[0];
    let tname = document.getElementById("post_tname").value;
    let loc = document.getElementById("post_loc").value;
    console.log("file:", inputFile); //debug




    //remove this later once every uploads uses files
    //OLD POST REQUEST, WHERE THERE IS NO FILE UPLOAD:
    if (!uploadKey || !inputFile) {
        if (!tname || !loc) {
            console.log("POST parameters incomplete. Canceling request.");
            window.alert("POST parameters incomplete. Canceling request.");
            return;
        }
        console.log("calling OLD POST request!!");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
        let input_data = {
            'tourName': tname,
            'location': loc,
            'key': uploadKey
        };
        console.log("input data:", input_data);
        console.log("url: ", url);
        
        fetch(url, 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                window.alert(data.message);
                document.getElementById("post_res").innerHTML = data.message;
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
            })
            return;
    }
    //end of old post upload.




    //the request is canceled if there are missing form parameters
    if (!uploadKey || !inputFile || !tname || !loc) {
        console.log("POST parameters incomplete. Canceling request.");
        window.alert("POST parameters incomplete. Canceling request.");
        return;
    }

    //getting Content-Type header value for our file upload
    let fileType = inputFile.type;
    if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
        console.log("Error: Input files must be of type image or video.");
        window.alert("Error: Input files must be of type image or video.");
        return;
    }

    
    //resources: https://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-javascript
    //https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html
    //inputs for the signed policy and encoding function
    //getting expiration date and current date

    //creating a policy and signing
    var expDate = new Date();
    //console.log(expDate);
    var hoursNow = expDate.getHours();
    var hoursExp = hoursNow + 1; //expiration set to 1 hour from now
    expDate.setHours(hoursExp);
    //console.log(expDate);
    var akey = "XXXX"; //Placeholder value. Supposed to be an account's AWS access key
    var skey = "XXXX"; //Placeholder value. Supposed to be an account's AWS secret key
    //console.log("akey:", akey); //debug
    //console.log("skey:", skey); //debug

    var expStr = expDate.toISOString();
    var dateNow = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "");
    var region = "us-east-1";
    var service = "s3";
    var creds = akey + "/" + dateNow.slice(0,-8) + "/" + region + "/" + service + "/aws4_request";
    //console.log("datenow:", dateNow); //debug
    //console.log("datenow(sliced):", dateNow.slice(0,-8)); //debug
    //console.log("expdate:", expDate); //debug
    //console.log("expStr:", expStr); //debug

    //following format from the posted resources
    var policy = { "expiration": expStr,
    "conditions": [
    {"bucket": "tourify-tours"},
    ["starts-with", "$key", "tours/"],
    {"acl": "public-read"},
    //{"success_action_redirect": "http://127.0.0.1:5500/upload.html"},
    ["starts-with", "$Content-Type", fileType.substring(0,5)],
    {"x-amz-meta-uuid": "14365123651274"},
    {"x-amz-server-side-encryption": "AES256"},
    ["starts-with", "$x-amz-meta-tag", ""],

    {"x-amz-credential": creds},
    {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
    {"x-amz-date": dateNow }
    ]
    };
    //console.log("Policy (before encoding):", policy); //debug

    //rendering 64encoded policy
    var encodedPolicy = window.btoa(JSON.stringify(policy));
    //document.getElementById("post_policy").value = encodedPolicy;
    //console.log("encoded policy:", encodedPolicy); //debug

    //rendering calculated signature
    var sigkey = getSignatureKey(skey, dateNow.slice(0,-8), region, service);
    //console.log("sigkey:", sigkey); //debug
    var signature = getSignature(encodedPolicy, sigkey);
    //console.log("signature:", signature); //debug


    //proceding with form-data POST request to S3 (key and file)
    uploadKey = "tours/"+ uploadKey;
    let fd = new FormData();
    fd.append("key", uploadKey);
    fd.append("acl", "public-read");
    fd.append("Content-Type", fileType);
    fd.append("x-amz-meta-uuid", "14365123651274");
    fd.append("x-amz-server-side-encryption", "AES256");
    fd.append("X-Amz-Credential", creds);
    fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
    fd.append("X-Amz-Date", dateNow.toString());
    fd.append("x-amz-meta-tag", "");
    fd.append("Policy", encodedPolicy);
    fd.append("X-Amz-Signature", signature);
    fd.append("file", inputFile);

    //making the call to S3
    fetch(bucketUrl, 
        {
            method: 'POST',
            body: fd
            //commented since this could be useful for the other methods later
            //{
                //"key": "tours/"+document.getElementById("pathKey").value,
                //"acl": "public-read",
                //"Content-Type": "image/jpeg",
                //"x-amz-meta-uuid": "14365123651274",
                //"x-amz-server-side-encryption": "AES256",
                //"X-Amz-Credential": creds,
                //"X-Amz-Algorithm": "AWS4-HMAC-SHA256",
                //"X-Amz-Date": dateNow.toString(),
                //"x-amz-meta-tag": "",
                //"Policy": encodedPolicy,
                //"X-Amz-Signature": signature
            //}
            //
        })
        //making a call through API Gateway to post onto DynamoDB (POSSIBLY CHANGE LATER TO MAKE FASTER UPLOADS)
        //currently there's always a status 204 code on S3 file upload, so an error case is not really implemented yet.
        .then((response) =>  {
            console.log("S3 response:", response);
            let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
            let input_data = {
                'tourName': tname,
                'location': loc,
                'key': uploadKey
            };
            console.log("input data:", input_data);
            console.log("url: ", url);
            
            fetch(url, 
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(input_data)
                })
                .then((response) => response.json().then((data) => {
                    console.log("response:", response);
                    console.log("data:", data);
                    window.alert(data.message);
                    document.getElementById("post_res").innerHTML = data.message;
                }))
                .catch((error) => {
                    console.log("error:", error);
                    window.alert(error);
                })
        })
        .catch((error) => {
            console.log("error:", error);
        })      
})
//



//OLD POST METHOD:
//POST creates a new record with tname and loc
/*
document.getElementById("post_btn").addEventListener("click", () => {
    console.log("inside button POST trigger");
    let tname = document.getElementById("post_tname");
    let loc = document.getElementById("post_loc");
    if (!tname.value || !loc.value) {
        console.log("POST parameters incomplete. Canceling request.");
        window.alert("POST parameters incomplete. Canceling request.");
        return;
    }
    let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
    let input_data = {
        'tourName': tname.value,
        'location': loc.value
    };
    console.log("input data:", input_data);
    console.log("url: ", url);
    
    fetch(url, 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(input_data)
        })
        .then((response) => response.json().then((data) => {
            console.log("response:", response);
            console.log("data:", data);
            window.alert(data.message);
        }))
        .catch((error) => {
            console.log("error:", error);
            window.alert(error);
        })
})
*/

//PUT updates a record with the given id, or makes one if it doesn't exist
document.getElementById("put_btn").addEventListener("click", () => {
    console.log("inside button PUT trigger");
    let id = document.getElementById("put_tid");
    let tname = document.getElementById("put_tname");
    let loc = document.getElementById("put_loc");
    let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/update";
    //also add a condition for file key and file later, like in the new post method
    if (!id.value || !tname.value || !loc.value) {
        console.log("PUT parameters incomplete. Canceling post.");
        window.alert("PUT parameters incomplete. Canceling post.");
        return;
    }
    let input_data = {
        'id': id.value,
        'tourName': tname.value,
        'location': loc.value
    };
    console.log("input data:", input_data);
    console.log("url: ", url);
    


    
    fetch(url, 
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(input_data)
        })
        .then((response) => response.json().then((data) => {
            console.log("response:", response);
            console.log("data:", data);
            window.alert(data.message);
            document.getElementById("put_res").innerHTML = data.message;
        }))
        .catch((error) => {
            console.log("error:", error);
            window.alert(error);
        })
})

//DELETE deletes a record with the given id if it exists
document.getElementById("del_btn").addEventListener("click", () => {
    console.log("inside button DELETE trigger");
    let id = document.getElementById("del_tid");
    let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/delete?id="+id.value;
    console.log("id: ", id.value);
    console.log("url: ", url);
    if (!id.value) {
        console.log("DELETE parameters incomplete. Canceling request.");
        window.alert("DELETE parameters incomplete. Canceling request.");
        return;
    }
    
    fetch(url, 
        {
            method: 'DELETE'
        })
        .then((response) => response.json().then((data) => {
            console.log("response:", response);
            console.log("data:", data);
            window.alert(data.message);
            document.getElementById("del_res").innerHTML = data.message;
        }))
        .catch((error) => {
            console.log("error:", error);
            window.alert(error);
        })
})

