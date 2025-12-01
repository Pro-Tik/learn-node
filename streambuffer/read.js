const fs = require('fs');

const ourStream = fs.createReadStream(`${__dirname}/bigdata.txt`,'utf-8');

ourStream.on('data',(data)=>{
    console.log(data);
})