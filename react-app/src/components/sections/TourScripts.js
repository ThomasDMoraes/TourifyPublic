//Contains functions that perform READ and WRITE operations on tours (DynamoDB and S3)
//These functions are to be restricted between users, creators, and admins

import { useState, createContext, useContext } from 'react';
import { AccountContext } from "./Account";
import {Amplify, Storage} from 'aws-amplify';
import UserPool from './UserPool';

import NotificationManager from 'react-notifications/lib/NotificationManager';

Amplify.configure({   
    Auth: {
        identityPoolId: 'us-east-1:3e9b7212-4b0b-4d06-b418-cd8ec3dd29db', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
        userPoolId: UserPool.userPoolId, //OPTIONAL - Amazon Cognito User Pool ID
        userPoolWebClientId: UserPool.clientId, //OPTIONAL - Amazon Cognito Web Client ID
    }, 
    Storage: {
        AWSS3: {
            bucket: 'tourify-tours', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
})

const TourScriptsContext = createContext(); //making it into a context to share functions with child components

const TourScripts = (props) => {
    
    const {getUser, getSession} = useContext(AccountContext);

    /**
     * Retrieves a matching tour's info. 
     * @param {string} id tour's ID in DynamoDB.
     * @returns a response object with tour data.
     */
    async function getByTourId(id) {
        console.log("Id =", id)
        console.log('Getting by tour ID...')
        if (!id) {
            NotificationManager.warning("ID field is empty. Try again.");
            console.log("No ID given. Stopping search...");
            return;
        }
        try {
            let userSession = await getSession();
            console.log("userSession:", userSession);
            return await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id, 
                {
                method: "GET",
                headers: {
                    "Authorization": userSession.idToken.jwtToken
                }
            })
            .then((response) => response.json().then((tData) => {
                console.log("response:", response);
                console.log("data:", tData);
    
                if (tData.id) { //match found
                    NotificationManager.success("Tour retrieved!");
                }
                else {
                    NotificationManager.warning(tData.message);
            }
            //setResponse(tData);
            return tData;
            }))
            .catch((err) => {
                console.log("unexpected error:", err);
                NotificationManager.error("Unexpected error. Try again.");
            })               
        }
        catch (err) {
            console.log("getSession err:", err);
        }
    } 


    /**
     * Retrieves a matching tour's info. 
     * @param {string} tname tour's name in DynamoDB.
     * @param {string} loc tour's location string in DynamoDB.
     * @returns a response object with an array of tours and their data.
     */
    async function getByTourNameLoc(tname, loc) {
        console.log("Tour name =", tname)
        console.log("Location =", loc)
        console.log('Getting by tour Name and location...')

        try {
            let userSession = await getSession();
            console.log("userSession:", userSession);
            return await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName=" + tname + "&location=" + loc, 
            {
                //auth header
                method: "GET",
                headers: {
                    "Authorization": userSession.idToken.jwtToken
                }
            })
            .then((response) => response.json().then((tData) => {
                console.log("response:", response);
                console.log("data:", tData);
                if (tData.length === 0) {
                    NotificationManager.warning("No matches found.");
                    console.log("No matches found!");
                }
                else {
                    NotificationManager.success("Tours retrieved!");
                    console.log("Tours retrieved!");
                }         
                return tData;
            }))
            .catch((err) => {
                console.log("unexpected error:", err);
                NotificationManager.error("Unexpected error. Try again.");
            })
        }
        catch (err) {
            console.log("getSession err:", err);
        }
    }

    /**
     * Posts a tour (DynamoDB record and S3 file)
     * @param {object} tourObj object with attributes to insert into DynamoDB
     * @param {File} inFile input image file
     * @returns 
     */
    async function postTour(tourObj, inFile) {
        console.log("Posting tourObj:", tourObj);
        console.log("Posting image:", inFile);
        if (!tourObj.name || !tourObj.loc || !inFile || !tourObj.coordinatesX || !tourObj.coordinatesZ) {
            console.log("Missing parameters! Try again.");  
            NotificationManager.warning("Missing parameters! Try again.");
            return;
        }
        let fileType = inFile.type;
        if (fileType.substring(0, 5) !== "image" && fileType.substring(0, 5) !== "video") {
            console.log("Error: Input files must be of type image or video.");
            NotificationManager.error("Error: Input files must be of type image or video.");
            return;
        }
        let uploadKey = "tours/" + inFile.name;
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
        //getting marker coordinates
        //note: each sphere on unity is around 1 unit long
        //var coordinates = getCoordinates(); //will be part of tourObj

        let input_data = {
            'tourName': tourObj.name,
            'location': tourObj.loc,
            'key': uploadKey,
            'x-coordinate': tourObj.coordinatesX, //current gives errors if they're not given.
            'z-coordinate': tourObj.coordinatesZ
        };
        console.log("input data:", input_data);
        console.log("url: ", url);
        try {
            let userSession = await getSession();
            console.log("userSession:", userSession);
            return await fetch(url, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": userSession.idToken.jwtToken
                    },
                    body: JSON.stringify(input_data)
                })
                .then((response) => response.json().then(async (data) => {
                    console.log("response:", response);
                    console.log("data:", data);
                    NotificationManager.success(data.message);
                    data.status = response.status;


                    await Storage.put(uploadKey, inFile, {contentType: "image"})
                    .then((data) => {
                        console.log("Uploaded file. Response data:", data);
                        NotificationManager.success("Tour file uploaded successfully!");
                    })
                    .catch((err) => {
                        console.log("Error uploading file: ", err);
                        NotificationManager.error("Tour file was not uploaded! Reversing changes...");
                        //DELETE THE TOUR RECORD (or use transactions on backend if possible) (reversing changes)
                    })

                    return data; //returning data and response status code to putRes
                }))
                .catch((error) => {
                    console.log("error:", error);
                    NotificationManager.error(error);
                    return error; //error already has a status code
                })
        }
        catch (err) {
            console.log("getSession err:", err);
        }
    }


    /**
     * Updates an existing tour (DynamoDB record and S3 file)
     * @param {object} tourObj object with attributes to insert into DynamoDB
     * @param {File} inFile input image file
     * @returns 
     */
    async function updateTour(tourObj, inFile){     
        console.log("Updating to tour:", tourObj);
        console.log("Updating to image:", inFile);
        if (!tourObj.id) {
            NotificationManager.warning("Missing ID parameter. Please pass the tour's ID and try again.");
            return;
        }
        else if (!tourObj.tourName && !tourObj.location && !tourObj["x-coordinate"] && !tourObj["z-coordinate"] && !inFile) {
            NotificationManager.warning("No update info given. No changes will be made.");
            return;
        }
        let updateKey;
        if (inFile && inFile.type && inFile.name) {
            let fileType = inFile.type;
            if (fileType.substring(0, 5) !== "image" && fileType.substring(0, 5) !== "video") {
                console.log("Error: Input files must be of type image or video.");
                NotificationManager.error("Error: Input files must be of type image or video.");
                return;
            }
            updateKey = "tours/" + inFile.name;
            tourObj.fileName = updateKey;
        }  
        
        console.log("input data:", tourObj);
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/update";
        try {
            let userSession = await getSession();
            console.log("userSession:", userSession);
            let putRes = await fetch(url, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": userSession.idToken.jwtToken
                    },
                    body: JSON.stringify(tourObj)
                })
                .then((response) => response.json().then(async (data) => {
                    //console.log("response:", response);
                    //console.log("data:", data);
                    NotificationManager.success(data.message);
                    //document.getElementById("put_res").innerHTML = data.message;
                    data.status = response.status;
                    if (updateKey) {
                        await Storage.put(updateKey, inFile, {contentType: "image"})
                        .then((data) => {
                            console.log("Uploaded file. Response data:", data);
                            NotificationManager.success("Tour file uploaded successfully!");
                        })
                        .catch((err) => {
                            console.log("Error uploading file: ", err);
                            NotificationManager.error("Tour file was not uploaded! Reversing changes...");
                            //next: reverse changes if failed? Can try to make transactions on the backend...
                        })
                    }

                    return data; //returning data and response status code to putRes
                }))
                .catch((error) => {
                    console.log("error:", error);
                    NotificationManager.error("Error updating tour.");
                    return error; //error already has a status code
                })
            return putRes; //returning putRes
        }
        catch (err) {
            console.log("getSession err:", err);
        }
    }

    /**
     * Calls the api that deletes tours in DynamoDB and S3
     * @param {string} id tour's id
     * @returns 
     */
    async function deleteByTourId(id) {
        console.log("inside button DELETE trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/delete?id="+id;
        console.log("id: ", id);
        console.log("url: ", url);
        if (!id) {
            console.log("DELETE parameters incomplete. Canceling request.");
            NotificationManager.warning("DELETE parameters incomplete. Try again.");
            return false;
        }
        let userSession = await getSession();
        console.log("userSession:", userSession);
        return await fetch(url, 
            {
                method: 'DELETE',
                headers: {
                    "Authorization": userSession.idToken.jwtToken
                }
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                if (response.status === 400) {
                    NotificationManager.warning(data.message); //tour not found, but no errors
                    return false;
                }
                else {
                    NotificationManager.success(data.message); //tour deleted
                    return true;
                }
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
                NotificationManager.error(error);
                return false;
            })
    }

    return (
        <TourScriptsContext.Provider value={{getByTourId, getByTourNameLoc, postTour, updateTour, deleteByTourId}}>
            {props.children}
        </TourScriptsContext.Provider>
    )

}
export {TourScripts, TourScriptsContext};