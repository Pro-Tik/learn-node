////module scaffodiling
const handler = {};

handler.notFoundHandler = (requestProperties,callback) =>{
    console.log(requestProperties);
    callback(404,{
        message: 'Your Requested URL was Not Found!'
    })

}

module.exports = handler;