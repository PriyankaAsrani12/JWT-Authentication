const express=require("express");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv")

const app=express();
dotenv.config();

app.use(express.json())

const posts=[
    {
        username: "Priyanka",
        post: "Post 1"
    },
    {
        username: "Hanisha",
        post: "Post 2"
    }
]
const refreshTokens=[]

app.post("/login",(req,res)=>{
    const username=req.body.username
    const user={name: username}
    const accessToken=generateAccessToken(user)
    const refreshtoken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshtoken)
    res.json({accessToken:accessToken,refreshtoken:refreshtoken})
})

app.post("/token",(req,res)=>{
    const refreshToken=req.body.token
    if(refreshToken==null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.sendStatus(403)
        }
        const accessToken=generateAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'})
}

app.listen(3700,()=>{
    console.log("Server is running on port 3700")
})
