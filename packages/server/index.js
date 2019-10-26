const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const allScores = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/register-player', (req, res, next) => {
    const playerName = req.query.name
    allScores.push({
        name: playerName,
        score: 0
    })
    res.json({
        success: true
    })
})

io.on('connection', socket => {
    console.log('CONNECTION')
})

io.on('')

http.listen(3000, function(){
    console.log('listening on *:3000')
})