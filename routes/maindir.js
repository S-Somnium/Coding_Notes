const express = require('express') 
const router = express.Router()
const path = require('path')

router.get('^/$|/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","start","index.html"))
})
router.get('/not(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","start","not.html"))
})
router.get('/old(.html)?',(req,res)=>{
    res.redirect(301,"../start/not.html")
})

module.exports = router