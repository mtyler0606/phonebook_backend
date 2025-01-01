const express = require('express')
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

app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const number = persons.length
    const timestamp = new Date()
    response.send( 
        `<p>Phonebook has info for ${number} people</p><p>${timestamp}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
      response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


function getID(){
    let id = 1
    while(persons.map(person => Number(person.id)).includes(id)){
        id = Math.floor(Math.random() * 1000) + 1
    }
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    const newPerson = { 
        id: getID(),
        name: body.name,
        number: body.number
    }

    console.log(request.body)
    persons = persons.concat(newPerson)

    response.json(newPerson)

})

const PORT = 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))