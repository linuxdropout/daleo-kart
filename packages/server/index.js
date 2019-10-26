const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const allPlayers = []

app.use(bodyParser())
app.use(express.static('www'))

app.post('/register-player', (req, res, next) => {
    const playerName = req.body.name
    const playerData = {
        name: playerName,
        score: 0
    }
    allPlayers.push(playerData)
    io.sockets.emit('newPlayer', playerData)
    res.json({
        success: true,
        allPlayers
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000')
})