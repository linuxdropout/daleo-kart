const GLOBALS = {
    scale: 0,
    msPerUpdate: 1000 / 60,
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

}

function draw(c, ctx) {
    ctx.fillRect(0, 0, c.width, c.height)
}

function loop(c, ctx, msPerUpdate, time = Date.now(), timeSinceLastUpdate = 0) {
    const ts = Date.now()
    const diff = time - ts
    timeSinceLastUpdate += diff
    while (timeSinceLastUpdate > msPerUpdate) {
        timeSinceLastUpdate -= msPerUpdate
        update()
    }
    draw(c, ctx)
    window.requestAnimationFrame(() => loop(c, ctx, msPerUpdate, ts, timeSinceLastUpdate))
}

function main(global) {
    const c = document.getElementById('canvas')
    setScale(c)
    window.addEventListener('resize', () => setScale(c))
    document.addEventListener('resize', () => setScale(c))
    const ctx = c.getContext('2d')
    loop(c, ctx, global.msPerUpdate)
}

document.addEventListener('DOMContentLoaded', () => main(GLOBALS))
