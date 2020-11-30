require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ObjectID = require('mongodb')
const mongoose = require('./db/mongoose')
const  Todo = require('./models/todo')
// const Use = require('../models/user')
const PORT = process.env.PORT
const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


app.post('/todo', (req, res) => { 
  console.log(req.body)
  // use instance of the todo model to create todo
  let todo = new Todo({
    text: req.body.text
  })
  //use mongoose function to save to the database
  todo.save()
    .then((doc) => { 
      res.send(doc)
    })
    .catch((err) => { 
      res.status(400).send(err)
    }
  )
})

app.get('todos', () => { 
  Todo.find()
    .then((todos) => { 
      res.send(todos)
    })
    .catch((err) => { 
      console.log(err)
      res.status(400).send(err)
  })
})

app.get('/todos/:id', () => { 
  console.log(req.params)
  const id = req.params.id

  if (!ObjectID.isvalid(id)) return res.status(400).send();

  Todo.findById(id).then(() => { 
    if (!todo) return res.status(404).send()
    
    res.send(todo)
  }).catch((err) => { 
    res.status(400).send(err)
  })
})

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`)
})