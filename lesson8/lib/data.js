//dependencies

const fs = require('fs');
const path = require('path');

const lib = {};

//base dir of data folder
lib.basedir = path.join(__dirname,'/../data/');

//write data to file

lib.create = (dir,file,data,callback)=>{
    //opne file for writing
    fs.open(lib.basedir+ dir+'/'+ file+'.json','wx', (err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            //stringify the data
            let stringData = JSON.stringify(data);

            //write the data to file
            fs.writeFile(fileDescriptor, stringData, (err)=>{
                if(!err){
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            callback(false);
                         }else{
                            callback('Error closing the new file')
                        }
                    });
                }else{
                    callback('Error Writing to the new file!')
                }
            })
        }else{
            console.log('System Error:', err);
            callback('Couldnot create new file, it may already exist');
        }
    });
}

lib.read = (dir,file,callback)=>{
    fs.readFile(lib.basedir+ dir+'/'+ file+'.json','utf-8',(err,data)=>{
        callback(err,data);
    })
}


lib.update = (dir, file,data,callback)=>{
    //file open for writing
    fs.open(lib.basedir+ dir+'/'+ file+'.json','r+',(err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            //convert data to string
            const stringData = JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                        //write to the file and close itr
                    fs.writeFile(fileDescriptor,stringData,(err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error Closing file');
                                }
                            })
                        }else{
                            callback('Error writing to file')
                        }
                    })
                }else{
                    callback("Error truncating file")
                }
            })
            
        }   else{
            console.log("Errpr Updating. File May Not exist");
        }
    })

}

//delete the file
lib.delete = (dir,file,callback)=>{
    //unlink
    fs.unlink(lib.basedir+ dir+'/'+ file+'.json',(err)=>{
        if(!err){
            callback(false);
        }else{
            callback('Error Deleting File');
        }
    })
}

module.exports=lib;