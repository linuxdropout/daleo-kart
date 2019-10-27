const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(http)

const gameLobbies = {

}

const allItems = require('./itemData.json')

app.use(cors())
app.use(bodyParser())
app.use(express.static('www'))

app.get('/item-data', (req, res) => res.json({
    itemData: allItems,
}))
app.get('/lobbies', (req, res) => res.status(200).json(gameLobbies).end())

app.post('/register-player', (req, res) => {
    const playerName = req.body.name
    const lobbyName = req.body.lobby

    const allPlayers = gameLobbies[lobbyName]

    if (allPlayers && allPlayers.filter(player => player.name === playerName).length === 0) {
        const playerData = {
            lobby: lobbyName,
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

    return res.json({
        success: false,
        message: 'A player with that name is already playing',
    })
})

io.on('connection', socket => {
    socket.on('getItem', scoreData => {
        console.log('SCORE DATA ', scoreData)
        const allPlayers = gameLobbies[scoreData.lobbyName]
        const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
        if (playerToGivePoints) {
            playerToGivePoints.basket.push(scoreData.item)
            playerToGivePoints.score += scoreData.item.points
            io.emit('setItem', scoreData)
        }
    })
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
})
