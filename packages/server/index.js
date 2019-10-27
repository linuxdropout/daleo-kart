const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(http)

const allPlayers = []
const allItems = require('./itemData.json')

app.use(cors())
app.use(bodyParser())
app.use(express.static('www'))

app.get('/item-data', (req, res) => res.json({
    itemData: allItems,
}))

app.post('/register-player', (req, res, next) => {
    const playerName = req.body.name
    if (allPlayers.filter(player => player.name === playerName).length === 0) {
        const playerData = {
            name: playerName,
            score: 0,
            basket: [],
        }
        allPlayers.push(playerData)
        io.sockets.emit('newPlayer', playerData)
        return res.json({
            success: true,
            allPlayers,
        })
    }

    res.json({
        success: false,
        message: 'A player with that name is already playing',
    })
})

io.on('connection', socket => {
    socket.on('getItem', scoreData => {
        console.log('SCORE DATA ', scoreData)
        const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
        if (playerToGivePoints) {
            playerToGivePoints.basket.push(scoreData.item)
            playerToGivePoints.score += scoreData.item.points
            io.emit('getItem', scoreData)
        }
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})
