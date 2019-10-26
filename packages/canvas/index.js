const GLOBALS = {
    scale: 0,
    msPerUpdate: 1000 / 60,
    GAME_OBJECTS: [],
    player: null,
    world: {
        bottom: -1000,
        top: 1000,
        left: -1000,
        right: 1000,
    },
}

function overlaps(obj1, obj2) {
    if (obj1 === obj2) return false
    if (
        obj1.right > obj2.x
        && obj1.x < obj2.right
        && obj1.top > obj2.y
        && obj1.y < obj2.top
    ) {
        return true
    }

    return false
}

const socket = io()
const keysDown = {
    up: false,
    down: false,
    left: false,
    right: false
}
let allPlayers = []


const setUpSockets = () => {
    socket.on('newPlayer', playerDetails => {
        allPlayers.push(playerDetails)
        const scoreBoard = document.getElementById('score-board')
        const newElement = document.createElement('div')
        newElement.innerHTML = `${playerDetails.name}: ${playerDetails.score}`
        scoreBoard.append(newElement)
    })
    socket.on('scoreIncrease', scoreData => {
        const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
        if (playerToGivePoints) {
            playerToGivePoints.score += scoreData.points
            Array.from(document.getElementsByClassName('player-score')).find(el => el.innerHTML.indexOf(scoreData.playerName) > -1).innerHTML = `${playerToGivePoints.name}: ${playerToGivePoints.score}`
        }
    })
}

const setInitialHighScores = players => {
    allPlayers = players

    const scoreBoard = document.getElementById('score-board')
    const scoreElements = players.map(player => {
        const newElement = document.createElement('div')
        newElement.className = 'player-score'
        newElement.innerHTML = `${player.name}: ${player.score}`

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
        this.coefResitution = 0.6
        this.collisionCoefFriction = 0.95
        this.coefFriction = 0.98
        this.color = 'white'

        this.dx = 0
        this.ddx = 0
        this.dy = 0
        this.ddy = 0

        GLOBALS.GAME_OBJECTS.push(this)
    }

    get left() {
        return this.x
    }

    set left(value) {
        this.x = value
    }

    get bottom() {
        return this.y
    }

    set bottom(value) {
        this.y = value
    }

    get top() {
        return this.y + this.h
    }

    set top(value) {
        this.y = value - this.h
    }

    get right() {
        return this.x + this.w
    }

    set right(value) {
        this.x = value - this.w
    }

    accelerate({ x = 0, y = 0 } = {}) {
        this.ddx += x
        this.ddy -= y
    }

    update(objectsInSpace) {
        if (this.ddx !== 0) {
            this.dx += this.ddx
            this.x += this.dx
            this.ddx = 0
        } else {
            this.x += this.dx
            this.dx *= this.coefFriction
        }
        if (this.ddy !== 0) {
            this.dy += this.ddy
            this.y += this.dy
            this.ddy = 0
        } else {
            this.y += this.dy
            this.dy *= this.coefFriction
        }

        if (Math.abs(this.dy) < 1) this.dy = 0
        if (Math.abs(this.dx) < 1) this.dx = 0

        if (this.x < GLOBALS.world.left) {
            this.x = GLOBALS.world.left
            this.dx *= -this.coefResitution
            this.dy *= this.coefFriction
        }
        if (this.right > GLOBALS.world.right) {
            this.right = GLOBALS.world.right
            this.dx *= -this.coefResitution
            this.dy *= this.coefFriction
        }
        if (this.y < GLOBALS.world.bottom) {
            this.y = GLOBALS.world.bottom
            this.dy *= -this.coefResitution
            this.dx *= this.coefFriction
        }
        if (this.top > GLOBALS.world.top) {
            this.top = GLOBALS.world.top
            this.dy *= -this.coefResitution
            this.dx *= this.coefFriction
        }

        for (const object of objectsInSpace) {
            if (overlaps(this, object)) {
                if (this.collide) this.collide(object)
                if (object.collide) object.collide(this)
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}

class Wall extends GameObject { }

class Player extends GameObject {
    collide(object) {
        if (object instanceof Wall) {
            if (this.right > object.left && this.right - this.dx <= object.left) {
                this.right = object.left - 1
                this.dx *= -this.coefResitution
                this.dy *= this.coefFriction
            }
            if (this.left < object.right && this.left - this.dx >= object.right) {
                this.left = object.right + 1
                this.dx *= -this.coefResitution
                this.dy *= this.coefFriction
            }
            if (this.top > object.bottom && this.top - this.dy <= object.bottom) {
                this.top = object.bottom - 1
                this.dy *= -this.coefResitution
                this.dx *= this.coefFriction
            }
            if (this.bottom < object.top && this.bottom - this.dy >= object.top) {
                this.bottom = object.top + 1
                this.dy *= -this.coefResitution
                this.dx *= this.coefFriction
            }
        }
    }

    update(objectsInSpace) {
        this.ddx = keysDown.right ? 1 : (keysDown.left ? -1 : 0)
        this.ddy = keysDown.down ? 1 : (keysDown.up ? -1 : 0)
        
        super.update(objectsInSpace)
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
        object.update(GLOBALS.GAME_OBJECTS)
    }
}

function drawBackground(ctx) {
    const {
        top,
        bottom,
        left,
        right,
    } = GLOBALS.world
    ctx.drawImage(GLOBALS.backgroundImage, left, bottom, right - left, top - bottom)
}

function draw(c, ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    const camX = -GLOBALS.player.x + c.width / 2
    const camY = -GLOBALS.player.y + c.height / 2
    ctx.translate(camX, camY)

    drawBackground(ctx)
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
            case 'ArrowRight': keysDown.right = true
                break
            case 'ArrowLeft': keysDown.left = true
                break
            case 'ArrowUp': keysDown.up = true
                break
            case 'ArrowDown': keysDown.down = true
                break
        }
    })
    document.addEventListener('keyup', event => {
        switch (event.key) {
            case 'ArrowRight': keysDown.right = false
                break
            case 'ArrowLeft': keysDown.left = false
                break
            case 'ArrowUp': keysDown.up = false
                break
            case 'ArrowDown': keysDown.down = false
                break
        }
    })
}

async function cacheImages(images) {
    const imagePromises = []
    for (const image of images) {
        imagePromises.push(
            new Promise(resolve => {
                const img = new Image()
                img.src = image
                img.onload = () => resolve(img)
            }),
        )
    }
    return Promise.all(imagePromises)
}

async function main() {
    const [
        backgroundImage,
    ] = await cacheImages([
        'face.jpg',
    ])
    GLOBALS.backgroundImage = backgroundImage

    const c = document.createElement('canvas')
    document.getElementsByTagName('body')[0].append(c)

    setScale(c)
    window.addEventListener('resize', () => setScale(c))
    document.addEventListener('resize', () => setScale(c))
    const ctx = c.getContext('2d')

    const walls = []
    const aisleWidth = 500

    for (
        let x = GLOBALS.world.left + 100;
        x < GLOBALS.world.right - 100;
        x += aisleWidth
    ) {
        walls.push(
            new Wall({
                x, y: -900, w: 100, h: 1800,
            }),
        )
    }

    GLOBALS.player = new Player({
        x: -25,
        y: 925,
        w: 50,
        h: 50,
    })

    setupKeyBindings(GLOBALS.player)

    loop(c, ctx, GLOBALS.msPerUpdate)
}

// eslint-disable-next-line no-unused-vars
const enterUsername = async name => {
    const response = await fetch('/register-player', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
            name
        })
    })
    const res = await response.json()
    const registrationForm = document.getElementById('registration-form')
    registrationForm.parentElement.removeChild(registrationForm)
    setInitialHighScores(res.allPlayers)
    setUpSockets()
    main()
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form-submit').addEventListener('click', () => {
        const name = document.getElementById('username-input').value

        enterUsername(name)
    })
})
