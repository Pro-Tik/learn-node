// Title: Uptime Monitoring Software
// Description: A RESTFul API Monitor to check the uptime or downtime
// Author: Pratik Barua
// Date: Decemeber 2, 2025


//dependencies
const http = require('http');

const {handleReqRes} = require('./helpers/handleReqRes')



// app object - module scaffolding

const app = {};

//config


//handle request and response
app.handleReqRes = handleReqRes;

//create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port,()=>{
        console.log(`Listening to port ${app.config.port}`);
    });
}




//start the server

app.createServer();