const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/people')
const app = express()


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
//app.use(morgan('tiny'))
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError"){
        return response.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
    if(tokens.method(req, res) === "POST"){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
}
    else{
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
          ].join(' ')
    }
  }))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
   
})

app.get('/info', (request, response) => {
    const timestamp = new Date()
    const number = [1, 2]
    Person.find({}).then(persons => { response.send( 
        `<p>Phonebook has info for ${persons.length} people</p><p>${timestamp}</p>`
    )})
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
        response.json(person)
        } else {
            return response.status(400).json({error: "content missing"})
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number

    if (!name){
        return response.status(400).json({ 
            error: 'name missing' 
          })
    }
    else if (!number){
        return response.status(400).json({ 
            error: 'number missing' 
          })
    }


    const person = new Person({ 
        name: name,
        number: number
    })
    console.log(name, number)

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log(body.name, body.number, request.params.id)
    const person = {
        
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))