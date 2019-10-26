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
    if (allPlayers.filter(player => player.name === playerName).length === 0) {
        const playerData = {
            name: playerName,
            score: 0
        }
        allPlayers.push(playerData)
        io.sockets.emit('newPlayer', playerData)
        return res.json({
            success: true,
            allPlayers
        })
    }

    res.json({
        success: false,
        message: 'A player with that name is already playing'
    })
})

io.on('connection', socket => {
    console.log('CONNECTIon')
})

io.on('scoreIncrease', scoreData => {
    console.log(scoreData)
    const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
    playerToGivePoints.score += scoreData.points
    io.emit('scoreIncrease', scoreData)
})

http.listen(3000, function(){
    console.log('listening on *:3000')
})