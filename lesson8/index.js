// Title: Uptime Monitoring Software
// Description: A RESTFul API Monitor to check the uptime or downtime
// Author: Pratik Barua
// Date: Decemeber 2, 2025


//dependencies
const http = require('http');

const {handleReqRes} = require('./helpers/handleReqRes')

const env = require('./env');
const data = require('./lib/data');


// app object - module scaffolding

const app = {};

//testing file system

data.create('test','newFile',{'name':'Meow','Goal':'Software Engineer'},(err,data)=>{
    console.log(err,data);
})


//handle request and response
app.handleReqRes = handleReqRes;

//create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(env.port,()=>{
        console.log(`Listening to port ${env.port}`);
    });
}




//start the server

app.createServer();