let allPlayers = []

const enterUsername = name => {
    $.ajax({
        url: '/register-player',
        type: 'POST',
        data: {
            name
        },
        success: function(res) {
            const registrationForm = document.getElementById('registration-form')
            registrationForm.parentElement.removeChild(registrationForm)
            setInitialHighScores(res.allPlayers)
            setUpSockets()
        }
    })
}

const setUpSockets = () => {
    const socket = io()
    socket.on('newPlayer', function(playerDetails) {
        allPlayers.push(playerDetails)
        const scoreBoard = document.getElementById('score-board')
        const newElement = document.createElement('div')
        var newContent = document.createTextNode(`${playerDetails.name}: ${playerDetails.score}`); 
        newElement.append(newContent)

        scoreBoard.append(newElement)
    })
}

const setInitialHighScores = (players) => {
    allPlayers = players

    const scoreBoard = document.getElementById('score-board')
    const scoreElements = players.map(player => {
        const newElement = document.createElement('div')
        var newContent = document.createTextNode(`${player.name}: ${player.score}`); 
        newElement.append(newContent)

        return newElement
    })
    for (const element of scoreElements) {
        scoreBoard.append(element)
    }
}