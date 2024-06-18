const mongoose = require('mongoose')


mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI
//instead of hardcoding the url of the database here,
//we put an environment variable instead.
//the environment variable can be initialised and have a value set when you start 
//with npm run dev, you will do MONGODB_URI = .... npm run dev

//connect to the DB and if it's successful print connected to mongodb
//otherwise print that you couldn't and why you couldn't

mongoose.connect(url).then((result)=>{
    console.log("Connected to mongoDB")
}).catch((error)=>{
    console.log("Couldn't connect to db",error.message)
})

const phoneValidator = {
  validator: function(v) {
    // Regular expression to match the phone number format
    const phoneRegex = /^(\d{2,3})-(\d+)$/
    return phoneRegex.test(v)
  },
  message: props => `${props.value} is not a valid phone number!` //this is going to be the error.message
  //at the errorHandler in index.js
}


//create the numberSchema.
const numberSchema = new mongoose.Schema({
    name:{ //validation.
      type:String,
      minLength:[3,'Name must be at least 3 characters long!']
    },
    number:{
      type:String,
      minLength:[8,'Phone number must be at least 8 characters long!'],
      validate:phoneValidator
    }
})


//the objects that mongoose returns are transformed without the ___v part
//and the id becomes .id = string and not an object.

numberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Number',numberSchema) //export the model.