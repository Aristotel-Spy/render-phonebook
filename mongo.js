const mongoose = require('mongoose')


const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.m06vlcg.mongodb.net/phoneApp?
  retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)

mongoose.connect(url) //connect to the database.

//create the schema for the number type objects.

//create the numberSchema.
const numberSchema = new mongoose.Schema({
    name:String, //set name and number as strings.
    number:String
})

//create the model.

//the collection will be called numbers on our phoneApp database

const Number = mongoose.model('Number',numberSchema)

//if you have added more than 3 parameters at powershell when running 
//the script,it means that you added a name and a number.

if(process.argv.length>3){

    const Name = process.argv[3]

    const Num = process.argv[4]

    const number = new Number({
        name:Name,
        number:Num
    })

    //save the Number object.

    number.save().then((result) =>{
        console.log(`added ${Name} number ${Num} to phonebook`)
        mongoose.connection.close() //close the connection to the database.
    })

//if it's 3 or less arguments to the console, it means you want to print.
} else {

    //fetch from the database and print.
    //insert empty object {} as argument to fetch everything.
    //the result is a list/array containing all the objects found.

    console.log("Phonebook");

    Number.find({}).then((result) =>{

        //print each name and number.
        //num is an object retrieved from the database
        result.forEach(num=>{
            console.log(`${num.name} ${num.number}`)
        })

        //close connection
        mongoose.connection.close()

    })

}



