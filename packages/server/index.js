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

    if (!gameLobbies[lobbyName]) {
        gameLobbies[lobbyName] = {
            players: [],
        }
    }

    const allPlayers = gameLobbies[lobbyName].players

    console.log(allPlayers)

    if (allPlayers && allPlayers.filter(player => player.name === playerName).length === 0) {
        const playerData = {
            lobby: lobbyName,
            name: playerName,
            score: 0,
            basket: [],
            position: {
                dx: 0,
                dy: 0,
                x: -25,
                y: 925,
                w: 50,
                h: 50,
            },
        }
        allPlayers.push(playerData)
        console.log(allPlayers)
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
        const allPlayers = gameLobbies[scoreData.lobbyName].players
        const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
        if (playerToGivePoints) {
            playerToGivePoints.basket.push(scoreData.item)
            playerToGivePoints.score += scoreData.item.price
            io.emit('setItem', scoreData)
        }
    })

    socket.on('requestPositions', () => {
        socket.broadcast.emit('requestPositions')
    })

    socket.on('updatePosition', data => {
        const allPlayers = gameLobbies[data.lobbyName].players
        console.log(allPlayers)
        console.log(data)
        const playerToUpdate = allPlayers.find(player => player.name === data.name)
        if (playerToUpdate) {
            playerToUpdate.position = {
                x: data.x,
                y: data.y,
                h: data.h,
                w: data.w,
            }
            socket.broadcast.emit('updatePosition', data)
        } else {
            console.log('ERR: no player to update')
        }
    })
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
})
