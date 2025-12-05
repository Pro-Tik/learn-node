//module scaffodiling
const handler = {};
const data = require('../../lib/data');
const utils = require('../../helpers/utilities')

handler.userHandler = (requestProperties, callback) =>{
    const acceptedMethods =['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        
    handler._users[requestProperties.method](requestProperties,callback);

    }
    else{
        callback(405,{
        message: 'Method Does not exist',

    });

    }
    console.log(requestProperties);
    
};

handler._users= {};
handler._users.post = (requestProperties,callback)=>{
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName.trim(): false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length>0 ?requestProperties.body.lastName.trim():false;

    const mobileNumber = typeof(requestProperties.body.mobileNumber) === 'string' && requestProperties.body.mobileNumber.trim().length === 11 ? requestProperties.body.mobileNumber.trim():false;

    const pass = typeof(requestProperties.body.pass) === 'string' && requestProperties.body.pass.trim().length > 6 ?requestProperties.body.pass.trim():false;

    const TosAg = (typeof(requestProperties.body.TosAg) === 'boolean' && requestProperties.body.TosAg) ? true : false;


    if(firstName && lastName && mobileNumber && pass && TosAg){
        //Check If The User Already Exists or not
        data.read('users', mobileNumber, (err,user)=>{
            if(err){
                //hash The pass
                let hashedPass = utils.hashing(pass);
                //next work
                let userObject = {
                    firstName,
                    lastName,
                    mobileNumber,
                    hashedPass,
                    TosAg
                };
                //store the userInfo to the database
                data.create('users', mobileNumber,userObject, (err)=>{
                    if(!err){
                        callback(200,{
                            'message': 'User Was Created Successfully'
                        });
                    }else{
                        callback(400,{
                            'error': 'Couldnot create user'
                        })
                    }
                })
            }
            else{
                callback(500,{
                    'error': 'There Was a Problem in the server'
                });
            }
        })
    }
    else{
        callback(400,{
            error: 'Bad Request'
        });
    }
};



//Authentication

handler._users.get = (requestProperties,callback)=>{
    //check if the phone number is valid
    const mobileNumber = typeof(requestProperties.queryStringObj.mobileNumber) === 'string' && requestProperties.queryStringObj.mobileNumber.trim().length === 11 ? requestProperties.queryStringObj.mobileNumber.trim():false;
    if(mobileNumber){
        //lookup for the user
        data.read('users',mobileNumber, (err,userData)=>{
            const user = { ...utils.parseJson(userData) }
            if(!err && user){
                delete userData.hashedPass;
                callback(200,{
                    user
                })
            }else{
                callback(404,{
                    'message': 'Error Finding The User' 
                });
            }
        })
    }else{
        callback(404,{
            'error': 'Phone Number Not Found'
        });
    }



};
handler._users.put = (requestProperties, callback)=>{
    // 1. Validate required fields (mobile number)
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName.trim(): false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length>0 ?requestProperties.body.lastName.trim():false;

    const mobileNumber = typeof(requestProperties.body.mobileNumber) === 'string' && requestProperties.body.mobileNumber.trim().length === 11 ? requestProperties.body.mobileNumber.trim():false;

    const pass = typeof(requestProperties.body.pass) === 'string' && requestProperties.body.pass.trim().length > 6 ?requestProperties.body.pass.trim():false;
    
    // Check if the mobile number is valid AND at least one field is provided for update
    if(mobileNumber){
        if(firstName || lastName || pass){
            
            // 2. Lookup the user (data.read)
            data.read('users', mobileNumber, (err, userData)=>{
                if(!err && userData){
                    // *** SUCCESS PATH: USER FOUND ***
                    
                    // Parse data before modifying
                    let user = utils.parseJson(userData); 
                    
                    // Apply updates to the user object
                    if(firstName){
                        user.firstName = firstName;
                    }
                    if(lastName){
                        user.lastName = lastName;
                    }
                    if(pass){
                        // Hash the new password before saving
                        user.hashedPass = utils.hashing(pass); 
                    }

                    // 3. Store the modified user object (data.update)
                    data.update('users', mobileNumber, user, (err)=>{
                        if(!err){
                            // Final Update SUCCESS
                            callback(200, {
                            'message': 'User was updated successfully'
                            });
                        }
                        else{
                            // Update FAILED (Server/file system error)
                            callback(500, {
                                'error':'Could not update user data on the server'
                            });
                        }
                    });
                    
                } else {
                    // *** FAILURE PATH 1: USER NOT FOUND ***
                    callback(404, {'error': 'The specified user was not found'});
                    return; // <-- CRITICAL: Prevents the code from falling through to data.update
                }
            })
            
        } else {
            // *** FAILURE PATH 2: No fields provided to update ***
            callback(400,{
            'error': 'Missing fields to update (firstName, lastName, or pass)'
        })
        }
    }
    else{
        // *** FAILURE PATH 3: Invalid mobile number ***
        callback(400,{
            'error': 'Invalid mobile number'
        })
    }
};
handler._users.delete = (requestProperties, callback)=>{
    // 1. Check for valid mobile number in query string
    const mobileNumber = typeof(requestProperties.queryStringObj.mobileNumber) === 'string' && requestProperties.queryStringObj.mobileNumber.trim().length === 11 ? requestProperties.queryStringObj.mobileNumber.trim():false;

    if(mobileNumber){
        // 2. Lookup the user (data.read)
        data.read('users', mobileNumber, (err, userData)=>{
            
            if(!err && userData){ // User FOUND, proceed to delete
                
                // 3. Delete the user (data.delete)
                data.delete('users', mobileNumber, (deleteErr)=>{
                    if(!deleteErr){
                        // SUCCESS
                        callback(200, {
                            'message': 'User was successfully deleted'
                        });
                    } else {
                        // SERVER FAILURE: Error during file/data deletion
                        callback(500, {
                            'error': 'Error occurred during deletion' 
                        });
                    }
                });
                
            } else {
                // USER NOT FOUND (or data.read failed)
                callback(404, {
                    'error': 'User was not found' 
                });
            }
            // CRITICAL: No need for 'return' here since the logic is correctly nested.
        });
    } else {
        // INVALID/MISSING PHONE NUMBER
        callback(400, { // Use 400 for client-side input error
            'error': 'Invalid mobile number'
        });
    }
};
module.exports = handler;