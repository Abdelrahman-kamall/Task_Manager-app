const sgmail = require('@sendgrid/mail')
const apiKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(apiKey)

const sendWelcomeEmail = (email,name) => {
    sgmail.send({
        to:email,
        from:'3bdelra7man.kamal@gmail.com',
        subject:'welcome to our task app',
        text:`Hello ${name}, \n Welcome to our Task-app .`
    })
}
const sendfinalEmail = (email,name ) =>{
    sgmail.send({
        to:email,
        from:'3bdelra7man.kamal@gmail.com',
        subject:'feedback message',
        text:`Hello ${name}, \n we hope we served you well , if there is andy thing we can do to improve our 
        servvice please inform us .`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendfinalEmail
}