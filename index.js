const express = require('express') //importing express framework.
const morgan = require('morgan') //importing morgan.
const cors = require('cors')
const Number = require('./models/number') //import the mongoose module.

//import cors which allows us to bridge front-end and back-end
//basically allows the front-end to do HTTP requests to the back-end

const app = express() //setting it to the app variable.


app.use(express.json())  //middleware json parser required
//so that from HTTP POST request json objects turns to
// a javascript object, in the request.body

app.use(cors())

app.use(express.static('dist'))//in order to use the deployment mode
//of the front end, which will make it possible to access the front-end
//from the back-end server,if it hasn't been deployed to the internet,
//the default one in our case is 3001

//need to do app.use(middleware) before any route, so that the routes
//can use it. If you want only some routes to use it,you can put this
//code after some routes and before the ones you want to use it.

app.use(morgan('tiny')) //log to the console through the 
//tiny configuration
//numbers database
//let cause you want it to be updated.

//our error handler.

//the responses, coming from our errorHandler but also from the default,
//express errorHandler will be returned to axios in the front-end, which you can use
//.catch() to catch them.
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    //if it's not an CastError malformed id...
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({error:error.message})
    }
  
    next(error)//...it will be send to the default express errorhandler middleware.
  }
  
  
  
  // this has to be the last loaded middleware, also all the routes should be registered before this!
  
let numbers = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


//routing:

//to the root of your server, basically at the port.
//response of arrow function: what you respond to the front-end
//when the request is made.

//request, the data sent by the front end.
//and to get the parameters of the express
//such as /api/persons/:id <- id is a param.

app.get('/',(request,response) => {

    //server responds with welcome to the phonebook as a header.
    response.send('<h1> welcome to the phonebook! </h1>')


})

//route to the phonebook :

app.get('/api/persons',(request,response) => {

    //result is the array / list of the numbers from the db.
    Number.find({}).then(result =>{

        response.json(result)

    })
    

    

})

//route for HTTP GET request on information.

app.get('/info',(request,response)=>{

    
    //result is the list of persons in the db, so we get it's length
    Number.find({}).then(result=>{

        const INFO = `<p>Phonebook has info for ${result.length} people </p>
    <p> ${new Date()} </p>`

        response.send(INFO)

    })

    

    //new Date() instantiate a date object using
    //new and the parametreless constructor of the date class

    

})

//route for HTTP GET requests on each individual person.

//id is the express param, we can get it from the request 

app.get('/api/persons/:id',(request,response,next) =>{

    //use the findbyid method of mongoose. also send error to middleware.

    Number.findById(request.params.id).then(person =>{
        //if person is not undefined:
        if(person){
            //it means that it was found.

            response.json(person) //return the found object that has been transformed in the Schema.
        } else {
            //if the person is undefined it means it wasn't found.

            response.status(404).end()//404 person not found basically.
        }
    }).catch(error=>{
        //we catch the exception and send it to next aka the middleware.
        next(error)
    })
})

//Route for HTTP DELETE

app.delete('/api/persons/:id',(request,response,next) =>{

    //we use the mongoose .findByIdAndDelete() method.

    

    Number.findByIdAndDelete(request.params.id).then((result)=>{

        //respond with 204, which is used when deletion is successful.
        response.status(204)

        //we also handle the error.
    }).catch(error=>{
        next(error) //we send it to our own middleware, if error doesn't match our own
        //set error types, it will be sent to the default express errorhandler middleware.
    })
})

//Route for HTTP POST


app.post('/api/persons',(request,response,next)=>{

    const BODY = request.body//body is parsed into a JS object
    //from the middleware json-parser.

    //if the name is missing:
    if(!BODY.name){

        return response.status(400).json({error:'Name is missing!'})

    }

    //if the number is missing:

    if(!BODY.number){

        return response.status(400).json({error:'Number is missing!'})
    }

    const newPerson = Number({
        name:BODY.name,
        number:BODY.number
    })

    newPerson.save().then(result =>{

        response.json(result) //result is the object returned by mongoose,modified.
    }).catch(error=>{
        next(error) //name validation and number.
    })

    
})

//update the person's number.
//using the HTTP PUT.



app.put('/api/persons/:id',(request,response,next)=>{

    //we use the findByIdAndUpdate() mongoose method.

    const BODY = request.body

    console.log("ENTERED HERE!")

    //the findByIdAndUpdate() method, doesn't take an object that has been created
    //by the model constructor, such as const person = Number({...})
    //instead it takes a normal javascript object.

    //we create the object.

    const person = {
        name:BODY.name,
        number:BODY.number //the updated number returned from the front-end.
    }

    //We added the optional { new: true } parameter, which 
    //will cause our event handler to be called with the new modified document instead of the original.

    Number.findByIdAndUpdate(request.params.id, person, { new:true }).then(updatedPerson=>{
        response.json(updatedPerson)//we return as json the updatedPerson returned from the db
        //via mongoose with the schema transformations.
    }).catch(error=>{
        next(error) //send the error to be handled by the errorHandler.
    })

})





app.use(errorHandler)


const PORT = process.env.PORT || 3001
//set it to an environment port if it is found(from web-deploying)
//such as render,else if not found at the localhost.
//listens the HTTP requests from the port 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })