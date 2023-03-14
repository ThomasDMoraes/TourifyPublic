import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_7hyX9W1Hh",
    ClientId: "hbd3s93h472qkohe6a3v5h7c2"
}

export default new CognitoUserPool(poolData);