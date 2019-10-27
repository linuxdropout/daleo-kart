const GLOBALS = {
    scale: 0,
    msPerUpdate: 1000 / 30,
    GAME_OBJECTS: [],
    itemData: [],
    amazonItems: [],
    basket: [],
    player: null,
    world: {
        bottom: -1000,
        top: 1000,
        left: -1000,
        right: 1000,
    },
}
let socket = null

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

const keysDown = {
    up: false,
    down: false,
    left: false,
    right: false,
}
let allPlayers = []


const setUpSockets = () => {
    if (!io) return
    socket = io('https://aliptahq.com')
    socket.on('newPlayer', playerDetails => {
        allPlayers.push(playerDetails)
        const scoreBoard = document.getElementById('score-board')
        const newElement = document.createElement('div')
        newElement.innerHTML = `${playerDetails.name}: ${playerDetails.score}`
        scoreBoard.append(newElement)
    })
    socket.on('getItem', scoreData => {
        console.log('SCORE DATA ', scoreData)
        const playerToGivePoints = allPlayers.find(player => player.name === scoreData.playerName)
        if (playerToGivePoints) {
            playerToGivePoints.basket.push(scoreData.item)
            playerToGivePoints.score += scoreData.item.price
            Array.from(document.getElementsByClassName('player-score')).find(el => el.innerHTML.indexOf(scoreData.playerName) > -1).innerHTML = `${playerToGivePoints.name}: ${playerToGivePoints.score}`
        }
        if (GLOBALS.player.username === scoreData.playerName) {
            const basketElement = document.getElementById('basket')
            const newItem = document.createElement('div')
            newItem.className = 'basket-item'
            const newItemImage = document.createElement('img')
            const newItemName = document.createElement('div')
            newItemName.innerHTML = scoreData.item.name
            newItemImage.src = GLOBALS.itemData.find(item => {
                console.log(item)
                console.log(scoreData.item)
                return item.name === scoreData.item.name
            }).imageSrc

            newItem.append(newItemImage)
            newItem.append(newItemName)
            basketElement.append(newItem)
        }
    })
}

const setInitialHighScores = players => {
    allPlayers = players

    console.log(players)

    const scoreBoard = document.getElementById('score-board')
    const scoreElements = players.map(player => {
        const newElement = document.createElement('div')
        newElement.className = 'player-score'
        newElement.innerHTML = `${player.name}: ${player.score}`

        return newElement
    })
    const scoreBoardTitle = document.createElement('h3')
    scoreBoardTitle.innerHTML = 'Scores:'
    scoreBoard.append(scoreBoardTitle)
    for (const element of scoreElements) {
        scoreBoard.append(element)
    }
}

const setInitialBasket = () => {
    const basketElement = document.getElementById('basket')
    const basketTitle = document.createElement('h3')
    basketTitle.innerHTML = 'Your Basket:'
    basketElement.append(basketTitle)
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

    isLeftOf(object) {
        return ((this.right + this.left) * 0.5 < ((object.left + object.right) * 0.5))
    }

    isRightOf(object) {
        return ((this.right + this.left) * 0.5 > ((object.left + object.right) * 0.5))
    }

    isAbove(object) {
        return ((this.top + this.bottom) * 0.5 < ((object.top + object.bottom) * 0.5))
    }

    isBelow(object) {
        return ((this.top + this.bottom) * 0.5 > ((object.top + object.bottom) * 0.5))
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

class AmazonItem extends GameObject {
    constructor(opts) {
        super(opts)
        this.price = opts.price
        this.image = opts.image
        this.itemName = opts.itemName
    }

    collide(object) {
        if (object instanceof Wall || object instanceof AmazonItem) {
            if (this.right > object.left && this.isLeftOf(object)) {
                this.right = object.left - 1
            }
            if (this.left < object.right && this.isRightOf(object)) {
                this.left = object.right + 1
            }
            if (this.top > object.bottom && this.isBelow(object)) {
                this.top = object.top + 1
            }
            if (this.bottom < object.top && this.isBelow(object)) {
                this.top = object.bottom - 1
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
    }

    static generate() {
        const { itemData } = GLOBALS
        const randomIndex = Math.floor(Math.random() * itemData.length)
        const randomItem = itemData[randomIndex]

        const randomXCoordinate = Math.floor(
            Math.random() * (GLOBALS.world.right - GLOBALS.world.left),
        ) + GLOBALS.world.left
        const randomYCoordinate = Math.floor(
            Math.random() * (GLOBALS.world.top - GLOBALS.world.bottom),
        ) + GLOBALS.world.bottom
        const newAmazonItem = new AmazonItem({
            price: randomItem.price,
            image: randomItem.image,
            itemName: randomItem.name,
            x: randomXCoordinate,
            y: randomYCoordinate,
            w: 50,
            h: 50,
        })
        return newAmazonItem
    }
}

class Player extends GameObject {
    constructor(opts) {
        super(opts)
        this.username = opts.username
    }

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
        if (object instanceof AmazonItem) {
            const itemToAdd = GLOBALS.itemData.find(item => item.name === object.itemName)
            socket.emit('getItem', {
                playerName: this.username,
                item: itemToAdd,
            })
            GLOBALS.GAME_OBJECTS.splice(GLOBALS.GAME_OBJECTS.indexOf(object), 1)
            AmazonItem.generate()
        }
    }

    update(objectsInSpace) {
        this.ddx = keysDown.right ? 1 : (keysDown.left ? -1 : 0)
        this.ddy = keysDown.down ? 1 : (keysDown.up ? -1 : 0)

        super.update(objectsInSpace)
    }

    draw(ctx) {
        ctx.drawImage(GLOBALS.trolleyImage, this.x, this.y, this.w, this.h)
    }
}

function setScale(canvas, targetWidth = 1280, targetHeight = 720) {
    const body = document.getElementById('body')
    const scaleX = body.clientWidth / targetWidth
    const scaleY = body.clientHeight / targetHeight
    const scale = Math.min(scaleX, scaleY)

    GLOBALS.scale = scale
    canvas.width = body.clientWidth
    canvas.height = body.clientHeight // * (targetHeight / targetWidth)
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
    const ptrn = ctx.createPattern(GLOBALS.backgroundImage, 'repeat')
    ctx.fillStyle = ptrn
    ctx.fillRect(left, bottom, right - left, top - bottom)
}

function draw(c, ctx) {
    const { top, right } = GLOBALS.world

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    let camX = -GLOBALS.player.x + c.width / 2

    if (camX > right) {
        camX = right
    }
    if (camX < c.clientWidth - right) {
        camX = c.clientWidth - right
    }
    let camY = -GLOBALS.player.y + c.height / 2
    if (camY > top) {
        camY = top
    }
    if (camY < c.clientHeight - top) {
        camY = c.clientHeight - top
    }

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

function setupKeyBindings() {
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

async function main(name, initialPlayers) {
    const c = document.createElement('canvas')
    const body = document.getElementById('body')
    body.append(c)

    setScale(c)
    window.addEventListener('resize', () => setScale(c))
    document.addEventListener('resize', () => setScale(c))
    const ctx = c.getContext('2d')

    setInitialHighScores(initialPlayers)
    setInitialBasket()

    const walls = []
    const aisleWidth = 500

    for (
        let x = GLOBALS.world.left + 100;
        x < GLOBALS.world.right - 100;
        x += aisleWidth
    ) {
        const wall = new Wall({
            x, y: -900, w: 100, h: 1800,
        })
        wall.color = ctx.createPattern(GLOBALS.shelvingImage, 'repeat')
        walls.push(wall)
    }

    GLOBALS.player = new Player({
        username: name,
        x: -25,
        y: 925,
        w: 50,
        h: 50,
    })

    AmazonItem.generate()

    setupKeyBindings(GLOBALS.player)

    loop(c, ctx, GLOBALS.msPerUpdate)
}

// eslint-disable-next-line no-unused-vars
const enterUsername = async name => {
    const response = await fetch('https://aliptahq.com/register-player', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
            name,
        }),
    })
    const res = await response.json()
    if (res.success) {
        const registrationForm = document.getElementById('registration-form')
        registrationForm.parentElement.removeChild(registrationForm)

        setUpSockets()
        main(name, res.allPlayers)
    } else {
        console.log(res)
    }
}

// eslint-disable-next-line no-unused-vars
async function start(images, itemData) {
    const cachedImages = await cacheImages(images)
    const [
        backgroundImage,
        shelvingImage,
        trolleyImage,
    ] = cachedImages
    for (let i = 3; i < cachedImages.length; i++) {
        itemData[i - 3].image = cachedImages[i]
    }
    GLOBALS.backgroundImage = backgroundImage
    GLOBALS.shelvingImage = shelvingImage
    GLOBALS.trolleyImage = trolleyImage
    GLOBALS.itemData = itemData
}
