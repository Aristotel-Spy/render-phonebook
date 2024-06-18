import axios from 'axios'

const baseUrl = '/api/persons'
//configure to a relative url.
//it will automatically go to the same URL where the backend is
//this is no problem if you have dist and the backend contains
//the middleware to set the front end to the backend
//however if u are running in development mode only the front end
//it will be a problem that's why a proxy is set at vite.config.js


//the errors that axios returns through catch are errors returned from the back-end.

const getAll = () =>{

    return axios.get(baseUrl)
}

const inputNum = (newObject) =>{

    return axios.post(baseUrl,newObject)
}

const replaceNum = (newObject,id) =>{

    return axios.put(`${baseUrl}/${id}`,newObject)
}

const deleteNum = (id) =>{

    return axios.delete(`${baseUrl}/${id}`)
}


export default {
    getAll:getAll,
    inputNum:inputNum,
    deleteNum:deleteNum,
    replaceNum:replaceNum
}