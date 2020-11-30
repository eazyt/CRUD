require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
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

app.get('/todos', (req, res) => { 
  Todo.find()
    .then((todos) => { 
      res.send({ todos })
    })
    .catch((err) => { 
      console.log(err)
      res.status(400).send(err)
  })
})

app.get('/todos/:id', (req, res) => { 
  console.log(req.params)
  const id = req.params.id

  if (!ObjectID.isValid(id)) return res.status(400).send();

  Todo.findById(id).then((todo) => { 
    if (!todo) return res.status(404).send()
    
    res.send({ todo })
  }).catch((err) => { 
    res.status(400).send(err)
  })
})

// Todo.remove({ text: 'How to' });
// findByOneAndRemove({text: 'How to'})
// findByIdAndRemove({_id: 'epokxlmasijsdsk49u0323-430fddl'})
app.delete('/todos/:id', (req, res) => { 
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(400).send({ error: 'Invalid ID' });

    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) return res.status(404).send()

      res.send({
        todo
      })
    }).catch((err) => {
      res.status(400).send(err)
    })
})

app.patch('/todos/:id', (req, res) => { 
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) return res.status(400).send({
    error: 'Invalid ID'
  });

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else { 
    body.completed = false,
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {
    $set: 
      body
    
  }, {
    new: true
  })
    .then((todo) => {
    if (!todo) return res.status(404).send()

    res.send({
      todo
    })
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`)
})