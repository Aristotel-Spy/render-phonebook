import { useState, useEffect} from 'react' //import use effect aswell
import numberService from './services/numbers'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notif'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Filter = ({ newFilter, handleFilter }) => {

  return(
    <form>
      <div>
          filter shown with: <input value={newFilter} onChange={handleFilter}/>
      </div>
    </form>
  )
}


const PersonForm =({ handleSubmit,nameOnChange,numberOnChange,newName,newNumber }) =>{

  return(
    <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={nameOnChange}/>
        </div>
        <div>
          number:  <input value={newNumber} onChange={numberOnChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

//takes the persons list as prop
const Persons = ({ persons, handleDelete }) =>{

  //here when we pass the event handler of handleDelete to our next child component Person
  //since we are at the stage where we need to use a parameter for our event handler
  //in order to pass the eventHandler correctly with a parameter we use an extra arrow function:
  //handleDelete = {()=>handeDelete(person.id)}

  //if your event handler doesn't take a parameter, you don't need to use an extra arrow,
  //if it needs a parameter you pass the parameter and the event handler on an arrow function
  //only at the stage which you need to pass it.
  return(
    <div>
    {persons.map(person=>{
      return(<Person  key={person.id} person={person} handleDelete={()=>handleDelete(person.id,person.name)}/>)
    })}
    </div>
  )

}

//takes the person object as a prop
const Person = ({ person, handleDelete }) =>{

  return(
    <div>
    {person.name} {person.number}
    <button onClick={handleDelete}>Delete</button>
    </div>
    )

}

const App = () => {


  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newNumber,setNewNumber] = useState('')

  const [newFilter,setFilter] = useState('')

  const [notif,setNotif] = useState(null)

  const [error,setError] = useState(null)

  //hook for the axios to get data from our json server which is run on the 
  //data found at personsdb.json

  const hook = () => {

    //get the data from there.
    numberService.getAll().then(response =>{

      setPersons(response.data) //we get the data and set it at the persons as a list.
    })
    
  }

  
  //then we use the useEffect function:

  useEffect(hook,[]) //the use effect will trigger the hook function, which will be run
  //by default when the app component gets re-rendered.
  //we set as it's second parameter an empty list which means that the useEffect function will be run
  //once.

  //event is the event from the input trigger.
  const nameOnChange = (event) =>{

    console.log(event.target.value) //testing reasons
    setNewName(event.target.value)
  }

  //event handler for the number.

  const numberOnChange = (event)=>{
    console.log(event.target.value) //testing reasons
    setNewNumber(event.target.value)

  }

  //event handler for on Submit

  const handleSubmit = (event) =>{

    event.preventDefault() //prevent default event after submission so that the page doesn't
    //reload

    console.log("sumbmission sent.")
    //alert("sumbitted!")

    //check if the newName exists in the phonebook:
    //first we map the list persons into a list of the names, then maybe 
    //we can use a Java .contains() method? or a python 'in' ? or just ===

    const personsNames = persons.map(person => person.name)

    if(personsNames.includes(newName)){ //similar to Java's contains() works only for primitives
      //alert(`${newName} is already on the phonebook!`) //alert that the name is already in the book.

      if(window.confirm(`${newName} is already on the phonebook,replace the old number with a new one?`)){

          const findPerson = persons.find(person => person.name === newName)
          
          //create a new person object as a shallow copy with a different reference
          //we don't want to mutate the existing person.

          const newPerson = {...findPerson,number:newNumber}

          numberService.replaceNum(newPerson,newPerson.id).then((response) => {

            setPersons(persons.map(person=>{

              if(person.name === newName){

                return response.data
              }else{
                return person
              }
            }))


          }).catch(error =>{
            //catch is asynchronous so the code which has the setNotif(`Added ${newName}`)
            //will be executed before catch and set a notification,that's why in here:

            setError(`Information of ${newName} has already been removed from the server.`)

            setNotif(null); //we need to set this to null again 
            //basically the code will execute catch faster, than the green notification can be shown
            //which will set the notification to null, even though the code below catch will execute first.

            setTimeout(() => {
              setError(null);
            }, 2000)

            
          })

          setNotif(`Added ${newName}`)

          setTimeout(() => {
            setNotif(null);
          }, 2000)

        } 

          setNewName('')
          setNewNumber('')

      //else if it returns false we continue.
    } else {

        //create the person object.

        //we don't create an id we let the server take care of it.

        const person = {name:newName,number:newNumber} //newName from the form event. and the newNumber


        numberService.inputNum(person).then(response=>{

          //concat the response.data which is what we posted to the json server (person)
          setPersons(persons.concat(response.data))


        })


        //when you set it reset the newName and number.

          setNotif(`Added ${newName}`)

          setTimeout(() => {
            setNotif(null);
          }, 2000)

          setNewName('')
          setNewNumber('')

    
      }

  }

  

  const handleDelete = (id,name) =>{

    //if true proceed with deletion
    if(window.confirm(`Delete ${name} ?`)){

      numberService.deleteNum(id)

      //filter out the persons which basically will return a new list with only the values
      //that passed the filter, in this case the filter was to whether the values had a different id.
      //the one that had the same id did not pass the filter so it won't be put in the new array
      //returned by the .filter() method,effectively deleting it from the persons list.

      setPersons(persons.filter(person =>{

        if(person.id !== id){
          return person
        }

      }))

    }else{ //else return from the event handler.
      return
    }

  }

  const handleFilter = (event) =>{
    setFilter(event.target.value)
  }

  let filteredPersons

  if(newFilter === ''){
     filteredPersons = persons
  } else {

     filteredPersons = persons.filter(person=> person.name.toLowerCase().includes(newFilter.toLowerCase()))
  }

  

  //The reason why you sometimes don't need a key on the .map() function is because I'm not returning
  //a react component or an HTML element.If you are returning a primitive data type such as a
  //string it is not necessary.
  //if you try to add a key when you return a primitive type you get an undefined error.
  //keys must only be added inside react components or html elements.
  //here we map the list to a list of divs we set as a key the name because there is no reason
  //to have the same name twice in the phonebook.

  //in this case where we pass the handleDelete event handler to our Persons component prop
  //we do not need an extra arrow function like this: handleDelete={()=>handledelete}
  //because we are not yet at the stage where we need to pass an argument to our event handler.

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notif}/>
      <Error message={error}/>

      <Filter newFilter={newFilter} handleFilter={handleFilter}/>

      <h3>Add a new</h3>

      <PersonForm handleSubmit={handleSubmit} nameOnChange={nameOnChange} numberOnChange={numberOnChange}
      newName={newName} newNumber={newNumber}/>


      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App