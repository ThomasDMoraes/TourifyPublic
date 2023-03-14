import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_xUbKBXTi6",
    ClientId: "5bo6g3iveh8d6rcmsg7qhd4pka"
}

export default new CognitoUserPool(poolData);