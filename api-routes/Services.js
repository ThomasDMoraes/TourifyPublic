const { default: axios } = require('axios');

async function getByTourId(id) {
    return axios.get("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id.value, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            mode: "cors",  
        },
    }).catch(function(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        }
        else {
            console.log('Error', error.message);
        }
        
        console.log(error.config);
    });
}

async function getByTourNameLoc(tname, loc) {
    return axios.get("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName="+tname.value+"&location="+loc.value, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            mode: "cors",  
        },
    }).catch(function(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        }
        else {
            console.log('Error', error.message);
        }
        
        console.log(error.config);
    });
}



module.exports={getByTourId, getByTourNameLoc}