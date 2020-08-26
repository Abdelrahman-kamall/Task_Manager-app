const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./Task')
const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    age : {
        type : Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('the age has to be a positive number')
            }
        }
    },
    email:{
        type:String,
        unique : true,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('this is not a valid email address')
            }
        }

    },
    password:{
        type:String,
        required:true,
        minlength:7,
        validate(val){
            if(val.toLowerCase().includes("password")){
                throw new Error('password cannot contain the word "password" in it')
            }
        }
    },
    tokens : [{
        token : {
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.statics.login = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('unable to log in')
    }
    if(await bcrypt.compare(password,user.password)){
        return user
    }
    throw new Error('unable to log in')
}
userSchema.methods.genAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'ay7agadlw2ty')
    user.tokens.push({token})
    await user.save()
    return token
    
}
userSchema.methods.toJSON = function(){
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
// agrb post kman
userSchema.post('remove',async function(next){
    const user = this
    //await Task.deleteMany({owner:this._id})
    
    await user.populate('tasks').execPopulate()
    const tasks = user.tasks
    //console.log(tasks)
    tasks.forEach( async task =>{
        await task.remove()
    })
    
    next()
})


userSchema.pre('save' ,async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
const User = mongoose.model('User',userSchema)

module.exports = User