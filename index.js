const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get("/api", (req,res)=>{
    res.json({
        message: "Welcome to the API"
    });
})

app.post("/api/posts", verifyToken, (req,res)=>{
    jwt.verify(req.token, "secretkey", (err, authData)=>{
        if(err){
            res.sendStatus(403);

        }else{
            res.json({
                message: "Post Created!",
                authData
            });
        }
    });
    
});

app.post("/api/login", verifyToken, (req,res) => {
    const user = {
        id:1,
        username: "naoki",
        email: "naoki@gmail.com"
    }
    jwt.sign({user}, 'secretkey', { expiresIn: '30' }, (err, token)=>{ 
        res.json({token})
    });
});

//Format of Token
//Authorization: Bearer <access_token> 

//Verify Token
function verifyToken(req, res, next){
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer in undefined
    if(typeof bearerHeader !== "undefined"){
        //Split at the space
        const bearer = bearerHeader.split(" ");
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middleware
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, ()=>console.log("server started on port 5000"));