const express = require("express")

const Task = require("../models/Task.js")

const router = new express.Router()



router.post("/tasks", async (req,res)=>{
    const newTask =  new Task(req.body)
    try{
        await newTask.save()
        res.status(201).send(newTask)
    }catch(e){
        res.status(400).send(e)
    }
    
})



router.get("/tasks", async (req,res)=>{
    const tasks = await Task.find({})
    try{
        if(!tasks){
            return res.status(204).send(tasks)
         }
         res.send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/tasks/:id", async (req,res)=>{
    const task = await Task.findById(req.params.id)
    try{
        if(!task){
            return res.status(204).send(task)
         }
         res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})




router.patch('/tasks/:id' , async (req,res) =>{
    const updateAttrs = Object.keys(req.body)
    const availableUpdates = ['description','completed']
    const flag = updateAttrs.every(each =>{
        return availableUpdates.includes(each)
    })
    if(!flag){
        return res.status(400).send({error : "this attribute can not be edited"})
    }
    
    try{
        const newTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!newTask){
            return res.status(204).send(newTask)
         }
         res.send(newTask)
    }catch(e){
        res.status(400).send(e)
    }
    
})



router.delete('/tasks/:id', async (req,res) =>{
    const del = await Task.findByIdAndDelete(req.params.id)
    try{
        if(!del){
            return res.status(204).send(del)
         }
        res.send(del)
    }catch(e){
        res.status(400).send(e)
    }
    
    
})

module.exports = router