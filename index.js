require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./person.js')
const PORT = process.env.PORT || 3001

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else {
    console.log("Something happened lol")
  }
  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  //console.log(id)
  console.log(next)
  Person
  .findById(id)
  .then(person => {
    console.log(person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person
  .find({})
  .then(persons => {
    console.log(persons)
    response.json(persons)
  })
})

/*const generateId = () => {
  let id = Number(Math.random() * 100000000)
  return id
}*/


app.post('/api/persons', (request, response, next) => {
  //console.log(request.body)
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ 
      error: 'field missing' 
    })
  }
  /*const existCheck = persons.map(p => p.name === request.body.name)
  if (existCheck.length >= 1) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }*/
  console.log(request.body)
  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })
  //persons = persons.concat(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    const errorMsg = next(error)
    console.log(errorMsg)
    return errorMsg
    //response.json(error.response.data)
    
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  /*
  
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
  */
  const id = request.params.id
  Person
  .findByIdAndRemove(id)
  .then(result =>  {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  date = new Date()
  console.log(date.toString())
  Person.find({}).then(resp => {
    response.send("<p>Phonebook has info for "+resp.length+" people</p>"+"<p>"+date.toString()+"</p>")
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(request.body)
  const person = {
    name: body.name,
    number: body.number
  }
  console.log(request.params.id)

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


/*
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))



let persons = [
  {
    "name": "Daniel Loi",
    "number": "4342332432",
    "id": 1
  },
  {
    "name": "Alvin",
    "number": "43940249",
    "id": 2
  },
  {
    "name": "Stephanie",
    "number": "4340394",
    "id": 3
  },
  {
    "name": "Albert ",
    "number": "r403940394",
    "id": 4
  },
  {
    "name": "fasfafas",
    "number": "432423432",
    "id": 5
  },
  {
    "name": "hhdhfdg",
    "number": "5453534",
    "id": 6
  },
  {
    "name": "ffasdsad",
    "number": "323423",
    "id": 7
  },
  {
    "name": "asdsdas",
    "number": "3232131",
    "id": 8
  }
]

const mongoose = require('mongoose')

password = "123Passw\)rd"

const url = `mongodb+srv://danielloi:${password}@cluster0.hbnrt.mongodb.net/persons-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log(id)
  const person = persons.find(person => {
    //console.log(person.id, id, person.id === id)
    return person.id === id
  })
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const generateId = () => {
  let id = Number(Math.random() * 100000000)
  return id
}

app.post('/api/persons', (request, response) => {
  //console.log(request.body)
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ 
      error: 'field missing' 
    })
  }
  const existCheck = persons.map(p => p.name === request.body.name)
  if (existCheck.length >= 1) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  
  const person = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number
  }
  persons = persons.concat(person)
  console.log(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  date = new Date()
  console.log(date.toString())
  response.send("<p>Phonebook has info for "+persons.length+" people</p>"+"<p>"+date.toString()+"</p>")
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})*/