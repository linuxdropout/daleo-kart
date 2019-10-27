const fs = require('fs')

const path = `${__dirname}/players.json`
const players = fs.existsSync(path)
    ? JSON.parse(fs.readFileSync(path))
    : []

process.on('exit', () => {
    fs.writeFileSync(path, JSON.stringify(players, null, 2))
})

function login(name) {
    const existingPlayer = players.find(player => player.name === name)
    if (existingPlayer) return existingPlayer

    const newPlayer = {
        highScore: 0,
        name,
    }
    players.push(newPlayer)
    fs.writeFileSync(path, JSON.stringify(players, null, 2))
    return newPlayer
}

module.exports = {
    login,
    get all() {
        return players
    },
}
