/* File: helpers/handleReqRes.js */
// Create an empty handler object to export later
const handler = {};

// Import Node.js URL module to parse request URLs
const url = require('url');

// Import StringDecoder to properly decode stream data from requests
const {StringDecoder} = require('string_decoder');

//import env
 

// Import all application routes
const routes = require('../routes');

// Import the notFoundHandler for undefined routes
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');

// Main request/response handler function
handler.handleReqRes = (req,res)=>{
    // Parse the incoming request URL
    const parsedUrl = url.parse(req.url,true);

    // Get the raw path from the URL
    const path = parsedUrl.pathname;

    // Trim beginning and trailing slashes to normalize path
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Convert the HTTP method to lowercase
    const method = req.method.toLowerCase();

    // Capture query parameters as an object
    const queryStringObj = parsedUrl.query;

    // Capture request headers
    const headersObj = req.headers;

    // Bundle all request information into one object
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj,
    };

    // Create a decoder to convert request data from buffer to UTF-8 text
    const decoder = new StringDecoder('utf-8');

    // Will accumulate decoded request body data
    let realData = '';

    // Event listener: receives chunks of request data
    req.on('data',(buffer)=>{
        realData += decoder.write(buffer);
    });

    // Event listener: runs once when request data stream ends
    req.on('end',()=>{
        // Finish decoding any remaining buffer
        realData += decoder.end();

        // Attach body data to requestProperties
        requestProperties.body = realData;

        // Select route handler if exists, else fallback to notFoundHandler
        const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

        // Call the selected route handler
        choosenHandler(requestProperties, (statusCode,payload)=>{
            // Ensure statusCode is a number
            statusCode = typeof(statusCode) ==='number' ? statusCode : 500;

            // Ensure payload is an object
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert payload object to JSON string
            const payloadString = JSON.stringify(payload);

            // Set response header for JSON response
            res.setHeader('Content-Type', 'application/json');

            // Write HTTP status code
            res.writeHead(statusCode);

            // End response and send payload
            res.end(payloadString);
        });
    });
}


// Export the handler object
module.exports = handler;