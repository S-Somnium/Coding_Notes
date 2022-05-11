const express = require('express') // npm i express
const cors = require('cors') // npm i cors
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000

//middleware -> its a feature that runs before the app.get and do something with the info.
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path}`)
    next()
})

// it will allow cross-origin-domain.. so much easier than GOLANG 
const whitelist =["http://localhost:3000","http://127.0.0.1:5500","https://www.google.com"] // if u want to allow everyone, u dont need whitelist.
const corsOptions ={ // if u want to allow everyone, u dont need this.
    origin: (origin,cb)=>{
        whitelist.indexOf(origin)!==-1||!origin?cb(null,true):cb(new Error('Not allowed by CORS'))
        // the !origin is readed like -> no origin
    },
    optionsSucessStatus: 200
}
app.use(cors(corsOptions))

//json files
app.use(express.json()) // this applies to all routers below it.

// static files for /
app.use("/",express.static("./public"))
app.use("/",require('./routes/maindir'))

// static files for /test
app.use("/test",express.static("./public"))
app.use("/test",require('./routes/subdir'))

app.use("/employees",require("./routes/api/employees")) // api


app.get('*',(req,res)=>{ //not found
    res.status(404)
    if(req.accepts('html')){
        res.sendFile("/start/404.html",{root:__dirname})
    }else if(req.accepts('json')){
        res.json({error: "404 not found"})
    }else{
        res.type('text').send("404 not found")
    }
})

app.listen(PORT, () => console.log(`server running on ${PORT}`))





