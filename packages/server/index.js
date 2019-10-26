const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const allPlayers = []

app.use(bodyParser())

app.get('/', (req, res) => {
    console.log(dirname + '/index.html')
    res.sendFile(__dirname + '/index.html')
})

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

console.log('STARTED')

// io.on('connection', socket => {
//     console.log('CONNECTION')
//     io.sockets.emit('newConnection', allPlayers)
// })

http.listen(3000, function(){
    console.log('listening on *:3000')
})