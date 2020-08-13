const express = require("express")

const Task = require("../models/Task.js")
const auth = require('../middleware/auth')

const router = new express.Router()



router.post("/tasks", auth, async (req,res)=>{
    //const newTask =  new Task(req.body)
    const newTask =  new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await newTask.save()
        res.status(201).send(newTask)
    }catch(e){
        res.status(400).send(e)
    }
    
})



router.get("/tasks", auth,async (req,res)=>{
    
    try{
        //const tasks = await Task.find({owner:req.user._id})
        await req.user.populate('tasks').execPopulate()
        /*if(!tasks){
            
            return res.status(204).send(tasks)
         }*/
         //res.send(tasks)
         res.send(req.user.tasks)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/tasks/:id",auth, async (req,res)=>{
    //const task = await Task.findById(req.params.id)
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(204).send(task)
         }
         res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})




router.patch('/tasks/:id' ,auth, async (req,res) =>{
    const updateAttrs = Object.keys(req.body)
    const availableUpdates = ['description','completed']
    const flag = updateAttrs.every(each =>{
        return availableUpdates.includes(each)
    })
    if(!flag){
        return res.status(400).send({error : "this attribute can not be edited"})
    }
    
    try{
        
        //const newTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({owner:req.user._id, _id:req.params.id})
        if(!task){
            return res.status(204).send(task)
         }
        updateAttrs.forEach(attr => task[attr] = req.body[attr])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
})



router.delete('/tasks/:id',auth, async (req,res) =>{
    
    try{
        const del = await Task.findOneAndDelete({_id:req.params.id ,owner:req.user._id})
        if(!del){
            return res.status(204).send(del)
         }
        res.send(del)
    }catch(e){
        res.status(400).send(e)
    }
    
    
})

module.exports = router