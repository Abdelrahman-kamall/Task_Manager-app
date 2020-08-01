const express = require("express")

const User = require("../models/User.js")


const router = new express.Router()

router.post("/users",(req,res)=>{
    const newUser = new User(req.body).save().then((result) =>{
        //console.log(req.body)
        
        res.status(201).send(result)
        //console.log(newUser)
    }).catch(e =>{
        res.status(400).send(e)
    })
})

router.get("/users",(req,res)=>{
    User.find({}).then(users =>{
        if(!users){
           return res.status(204).send(users)
        }
        res.send(users)
    }).catch(e=>{
        res.status(400).send(e)
    })
})

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

router.patch('/users/:id' , (req,res) =>{
    const updateAttrs = Object.keys(req.body)
    const availableUpdates = ['name','age','email','password']
    const flag = updateAttrs.every(each =>{
        return availableUpdates.includes(each)
    })
    if(!flag){
        return res.status(400).send({error : "this attribute can not be edited"})
    }
    User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).then(newUser =>{
        if(!newUser){
            return res.status(204).send(newUser)
         }
         res.send(newUser)
    }).catch(e =>{
        res.status(400).send(e)
    })
})


router.delete('/users/:id',(req,res) =>{
    User.findByIdAndDelete(req.params.id).then(del =>{
        if(!del){
            return res.status(204).send(del)
         }
        res.send(del)
    }).catch(e => res.status(400).send(e))
})

module.exports = router