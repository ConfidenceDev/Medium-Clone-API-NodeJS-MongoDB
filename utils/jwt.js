const jwt = require("jsonwebtoken")
/* const expressJwt = require("express-jwt")

function authJwt(){
    const secret = process.env.API_SECRET
    return expressJwt({
        secret, algorithms: ["HS256"]
    })
} */

function verifyToken(req, res, next){
    const bearerHeader = req.headers.authorization
    if(bearerHeader){        
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
    }else{
        return res.sendStatus(403)
    }
    next()
}

async function authJwt(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.API_SECRET, async (err, authData) => {
            if(!err){
                resolve(authData)
            }else{
                reject(err)
            }
        })
    })
}

module.exports = {
    verifyToken,
    authJwt
}