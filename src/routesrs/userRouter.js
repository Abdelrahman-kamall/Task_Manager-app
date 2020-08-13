const express = require("express")
const User = require("../models/User.js")
const auth = require('../middleware/auth')

const router = new express.Router()
router.post('/users/login',async (req , res)=>{
    try{
        const user = await User.login(req.body.email,req.body.password)
        const token = await user.genAuthToken()
        
        res.send({user,token})
    }catch(e){
        res.status(400).send({e})
    }
    
})
router.post('/users/logout',auth,async (req , res)=>{
    
    try{
        req.user.tokens = req.user.tokens.filter(curr => {
            return curr.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logoutAll',auth,async (req , res)=>{
    
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

router.post("/users", (req,res)=>{
    const newUser = new User(req.body).save().then(async (result) =>{
        //console.log(req.body)
        const token = await result.genAuthToken()
        res.status(201).send({result,token})
        
        //console.log(newUser)
    }).catch(e =>{
        res.status(400).send(e)
    })
})

router.get("/users/me",auth,(req,res)=>{
    res.status(200).send(req.user)
})
/*
router.get("/users/:id",(req,res)=>{
    User.findById(req.params.id).then(user =>{
        if(!user){
           return res.status(204).send(user)
        }
        res.send(user)
    }).catch(e=>{
        res.status(400).send(e)
    })
})
*/
router.patch('/users/me' ,auth,async (req,res) =>{
    const updateAttrs = Object.keys(req.body)
    const availableUpdates = ['name','age','email','password']
    const flag = updateAttrs.every(each =>{
        return availableUpdates.includes(each)
    })
    if(!flag){
        return res.status(400).send({error : "this attribute can not be edited"})
    }
    
    
        //const user = await User.findById(req.params.id)
        
        updateAttrs.forEach(attr => req.user[attr] = req.body[attr])
        
        req.user.save().then(newUser =>{
    //User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).then(newUser =>{
        if(!newUser){
            return res.status(204).send(newUser)
         }
         res.send(newUser)
        }).catch(e =>{
        res.status(400).send(e)
        })
    
    
})


router.delete('/users/me',auth, async (req,res) =>{
    /*User.findByIdAndDelete(req.params.id).then(del =>{
        if(!del){
            return res.status(204).send(del)
         }
        res.send(del)
    }).catch(e => res.status(400).send(e))*/
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
    
})

module.exports = router