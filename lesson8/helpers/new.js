//This Is for My practice


const handler = {};

const url = require('url');
const {StringDecoder} = require('string_decoder');


const routes = require('../routes');

const notFound = require('../handlers/routeHandlers/notFoundHandler');

handler.handleRequests = (req, res)=>{
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryObj= parsedUrl.query;
    const headerObj = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryObj,
        headerObj
    }
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data',(buffer)=>{
        realData += decoder.write(buffer);
    });
    res.on('end',()=>{
        realData += decoder.end();
        requestProperties.body =realData;

        const chooseHandler = routes[trimmedPath]?routes[trimmedPath]: notFound;

        chooseHandler(requestProperties,(statusCode,payload)=>{
            statusCode = typeof(statusCode)==='number'? statusCode: 500;
            payload = typeof(payload) === 'object'? payload:{};
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

        })
    })
}

module.exports= handler;