const express = require('express') //importing express framework.
const morgan = require('morgan') //importing morgan.
const cors = require('cors')
//import cors which allows us to bridge front-end and back-end
//basically allows the front-end to do HTTP requests to the back-end

const app = express() //setting it to the app variable.


app.use(express.json())  //middleware json parser required
//so that we can use HTTP POST to post our object in a json format

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

    response.json(numbers) //you respond with the numbers
    //in a json format.

    //so if the front end goes to /api/persons the numbers list will
    //be there, and the HTTP GET request will have a response of the list
    //aswell on the dev console.

    //content-type application/json express took care of it
    //when we did response.json()

})

//route for HTTP GET request on information.

app.get('/info',(request,response)=>{

    const INFO = `<p>Phonebook has info for ${numbers.length} people </p>
    <p> ${new Date()} </p>`

    //new Date() instantiate a date object using
    //new and the parametreless constructor of the date class

    response.send(INFO)

})

//route for HTTP GET requests on each individual person.

//id is the express param, we can get it from the request 

app.get('/api/persons/:id',(request,response) =>{

    const ID = Number(request.params.id)
    //get the id param from the request, and cast it to an integer.
    //(Number) in JS.

    //use the .find method to get the specific person object.

    const Person = numbers.find(person =>{
        //no need for such detail you could do it in 1 line
        //but it is more clear to understand.
        if(person.id === ID){
            return person
        }
    })

    //JS way to say Person === null or Person === undefined or
    //Person === false (if it's a boolean)

    if(!Person){

        //so basically here we return a 404 to the front-end HTTP request
        //and we also return a json object explaining why.

        return response.status(404).send("Invalid person ID!")

        

    }

    //since above we used "return" statement no need for an "else" block
    //since return will exit the .get() function.

    response.json(Person) //we respond with the Person object.

    //now that we have the specific person object we can
    //respond to the request with that person.

})

//Route for HTTP DELETE

app.delete('/api/persons/:id',(request,response) =>{

    const ID = Number(request.params.id)

    const Person = numbers.find(person => {
        if(person.id === ID){
            return person
        }
    })

    if(!Person){
        //respond with 404
        return response.status(404).send('Person ID not found.')
    }

    //if person found succesfully , remove it from database

    numbers = numbers.filter(person=>{
        if(person.id !== ID){
            return person
        }
    })

    response.status(204).end() //respond sucessfully and end.
})

//Route for HTTP POST


app.post('/api/persons',(request,response)=>{

    const BODY = request.body//body is parsed into a JS object
    //from the middle json-parser.

    //if the name is missing:
    if(!BODY.name){

        return response.status(400).json({error:'Name is missing!'})

    }

    //if the number is missing:

    if(!BODY.number){

        return response.status(400).json({error:'Number is missing!'})
    }

    //check if the name already exists, we use .find()

    const Person = numbers.find(person =>{

        if(person.name === BODY.name){

            return person
        }
    })

    //so if it is not undefined, it means it already exists.

    if(Person){

        return response.status(400).json({error:'name must be unique'})
    }

    //if we haven't returned anything yet, all is clear.

    //we create a new person object.

    const newPerson = {
        id:Math.floor(Math.random() * 10000),
        name:BODY.name,
        number:BODY.number
    }

    numbers.push(newPerson)

    response.json(newPerson)
})








const PORT = process.env.PORT || 3001
//set it to an environment port if it is found(from web-deploying)
//such as render,else if not found at the localhost.
//listens the HTTP requests from the port 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })