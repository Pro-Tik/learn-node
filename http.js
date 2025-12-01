const http = require('http');
const server = http.createServer((req,res)=>{

    if(req.url==='/'){
        res.write('Hello Welcome To The Server');
        res.end(); 
    }
    else if(req.url==='/aboutus'){
        res.write('I am A Server');
        res.end();
    }
    else{
        res.write('Sorry The Page Not Found');
        res.end();
    }
    
});



server.listen(3000);

console.log('Server Has Started in Port 3000');