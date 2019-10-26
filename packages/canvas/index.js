const GLOBALS = {
    scale: 0,
    msPerUpdate: 1000 / 60,
    GAME_OBJECTS: [],
}

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
            main()
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

class GameObject {
    constructor({
        x, y, w, h,
    }) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = 'white'

        this.dx = 0
        this.ddx = 0
        this.dy = 0
        this.ddy = 0

        GLOBALS.GAME_OBJECTS.push(this)
    }

    accelerate({ x = 0, y = 0 } = {}) {
        this.ddx += x
        this.ddy -= y
    }

    update() {
        this.dx += this.ddx
        this.x += this.dx
        this.ddx = 0
        this.dy += this.ddy
        this.y += this.dy
        this.ddy = 0
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}

function setScale(canvas, targetWidth = 1280, targetHeight = 720) {
    const body = document.getElementsByTagName('body')[0]
    const scaleX = body.clientWidth / targetWidth
    const scaleY = body.clientHeight / targetHeight
    const scale = Math.min(scaleX, scaleY)

    GLOBALS.scale = scale
    canvas.width = targetWidth * scale
    canvas.height = targetHeight * scale
}

function update() {
    for (const object of GLOBALS.GAME_OBJECTS) {
        object.update()
    }
}

function draw(c, ctx) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, c.width, c.height)
    for (const object of GLOBALS.GAME_OBJECTS) {
        object.draw(ctx, c)
    }
}

function loop(c, ctx, msPerUpdate, time = Date.now(), timeSinceLastUpdate = 0) {
    const ts = Date.now()
    const diff = ts - time
    timeSinceLastUpdate += diff
    while (timeSinceLastUpdate > msPerUpdate) {
        timeSinceLastUpdate -= msPerUpdate
        update()
    }
    draw(c, ctx)
    window.requestAnimationFrame(() => loop(c, ctx, msPerUpdate, ts, timeSinceLastUpdate))
}

function setupKeyBindings(player) {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowRight': player.accelerate({ x: 1 })
                break
            case 'ArrowLeft': player.accelerate({ x: -1 })
                break
            case 'ArrowUp': player.accelerate({ y: 1 })
                break
            case 'ArrowDown': player.accelerate({ y: -1 })
                break
        }
    })
}

function main() {
    const c = document.createElement('canvas')
    document.getElementsByTagName('body')[0].append(c)
    setScale(c)
    window.addEventListener('resize', () => setScale(c))
    document.addEventListener('resize', () => setScale(c))
    const ctx = c.getContext('2d')

    const player = new GameObject({
        x: 50,
        y: 50,
        w: 50,
        h: 50,
    })

    setupKeyBindings(player)

    loop(c, ctx, GLOBALS.msPerUpdate)
}
