//module scaffodiling
const handler = {};

handler.sampleHandler = (requestProperties, callback) =>{
    console.log(requestProperties);
    callback(200,{
        message: 'Hello Handler',

    });

};

module.exports = handler;