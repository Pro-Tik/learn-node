const http = require('http');
const server = http.createServer((req,res)=>{
    if(req.url==='/'){
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <form method="post" action="/process">
            <input type="text" name="msg">
            </form>
            <button>Submit</button>
        </body>
        </html>`;
        res.write(html);
        res.end(html);
    }

    else if(req.url==='/process' && req.method==='POST'){
        // req.on('data',(data)=>{
        //     console.log(data.toString());
        // })

        req.on('end',()=>{
            res.write('Data Received');
            res.end();
        })
        res.write('Reponded');
        res.end();
    }
});

server.listen(3000);

