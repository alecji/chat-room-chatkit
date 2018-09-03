const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const app = express()


const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:2c71e154-5d0b-4137-8aec-4088095b5730',
    key: 'c9798998-5a44-4ca7-978c-474c9bc92bb4:O8OEpnP9CnApnPYgt4r3XJpTFhWZiONCMPOEWJ7oKNE=',
  })
  

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({ 
	id: username, 
	name: username 
     })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})


const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
