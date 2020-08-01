const mongoose = require("mongoose")
const validator = require('validator')

const User = mongoose.model('User',{
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
    }
})

module.exports = User