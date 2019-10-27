const lobbies = {}

function createLobby(name) {
    if (lobbies[name]) return false
    lobbies[name] = {
        players: [],
    }
    return lobbies[name]
}

function joinLobby(name, playerName) {
    if (!lobbies[name]) return false
    if (lobbies[name].find(p => p.name === playerName)) return false

    lobbies[name].push({
        name: playerName,
        score: 0,
        basket: [],
        ready: false,
    })
    return lobbies[name]
}

module.exports = {
    createLobby,
    joinLobby,
    get all() {
        return lobbies
    },
}
