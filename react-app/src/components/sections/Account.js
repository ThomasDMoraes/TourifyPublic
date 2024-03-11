import React, {useState, createContext} from "react";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "./UserPool";



const AccountContext = createContext();


const Account = (props) => {

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        //status?
                        reject(err);
                    }
                    else {
                        //status?
                        resolve(session);
                    }
                })
            }
            else {
                reject();
            }
        });
    }

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({Username, Pool});
            const authDetails = new AuthenticationDetails({Username, Password});
    
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    //status?
                    console.log("onSuccess:", data);
                    resolve(data);
                },
                onFailure: (err) => {
                    console.error("onFailure:", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired:", data)
                    resolve(data);
                }
            })
        })
    }

    const logout = () => {
        console.log("logging out!");
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            //status?
            window.location.href = '/';
        }
    };

    const getUser = () => {
        return Pool.getCurrentUser();
    }

    return (
        <AccountContext.Provider value={{authenticate, getSession, logout, getUser}}>
            {props.children}
        </AccountContext.Provider>
    )

};

export {Account, AccountContext};