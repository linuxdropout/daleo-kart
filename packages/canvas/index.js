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

class GameObject {
    constructor({
        x, y, w, h,
    }) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.coefResitution = 0.6
        this.color = 'white'

        this.dx = 0
        this.ddx = 0
        this.dy = 0
        this.ddy = 0

        GLOBALS.GAME_OBJECTS.push(this)
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
        this.dx += this.ddx
        this.x += this.dx
        this.ddx = 0
        this.dy += this.ddy
        this.y += this.dy
        this.ddy = 0

        if (Math.abs(this.dy) < 1) this.dy = 0
        if (Math.abs(this.dx) < 1) this.dx = 0

        if (this.x < GLOBALS.world.left) {
            this.x = GLOBALS.world.left
            this.dx = this.dx * -this.coefResitution
        }
        if (this.right > GLOBALS.world.right) {
            this.right = GLOBALS.world.right
            this.dx = this.dx * -this.coefResitution
        }
        if (this.y < GLOBALS.world.bottom) {
            this.y = GLOBALS.world.bottom
            this.dy = this.dy * -this.coefResitution
        }
        if (this.top > GLOBALS.world.top) {
            this.top = GLOBALS.world.top
            this.dy = this.dy * -this.coefResitution
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

    const c = document.getElementById('canvas')
    setScale(c)
    window.addEventListener('resize', () => setScale(c))
    document.addEventListener('resize', () => setScale(c))
    const ctx = c.getContext('2d')

    GLOBALS.player = new GameObject({
        x: -25,
        y: 925,
        w: 50,
        h: 50,
    })
    GLOBALS.player.collide = obj => {
        obj.color = 'red'
    }

    const obstacles = [
        new GameObject({
            x: 100, y: 100, w: 100, h: 50,
        }),
        new GameObject({
            x: 300, y: 300, w: 100, h: 50,
        }),
        new GameObject({
            x: 500, y: 500, w: 100, h: 50,
        }),
        new GameObject({
            x: -450, y: -450, w: 100, h: 50,
        }),
        new GameObject({
            x: 700, y: 700, w: 100, h: 50,
        }),
    ]
    console.log(obstacles)

    setupKeyBindings(GLOBALS.player)

    loop(c, ctx, GLOBALS.msPerUpdate)
}

document.addEventListener('DOMContentLoaded', main)
