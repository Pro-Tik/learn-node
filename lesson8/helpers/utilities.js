//utility realted fields
const utilities = {};
const crypto = require('crypto');


//parse JSON string to json
utilities.parseJson= (JSONstring)=>{
    let output = {};

    try{
        output = JSON.parse(JSONstring);
    }catch{
        output = {};
    }
    return output;
}
utilities.hashing = (pass)=>{
    const hash = crypto.createHmac('sha256',"Pratik2005").update(pass).digest('hex');
    return hash;
}

module.exports = utilities;