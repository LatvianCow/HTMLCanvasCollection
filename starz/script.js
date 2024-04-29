const customization = {
    'size': 50,
    'strokeSize': 5,
    'rotIncr': 0.1,
    'minGapMult': 1.5,
    'maxCount': 50,
    'maxSpawnAttempts': 10,
    'controlPoint': 0,
    'hue': Number(getComputedStyle(document.body).getPropertyValue('--hue'))
}
let minGap = customization.minGapMult * customization.size
let rotationAlt = 0
for(let key in customization) {
    document.getElementById(key).value = customization[key]
}

function update() {
    for(let key in customization) {
        customization[key] = Number(document.getElementById(key).value)
    }
    minGap = customization.minGapMult * customization.size
    document.body.style.setProperty('--hue', customization.hue)
}

const canvas = document.getElementById('kanvas')
let hue = Number(getComputedStyle(document.body).getPropertyValue('--hue'))

let CWidth, CHeight
function onResize() {
    let bStyle = getComputedStyle(canvas.parentElement.parentElement)
    let bodyWidth = bStyle.width.slice(0, -2) - bStyle.paddingLeft.slice(0, -2) - bStyle.paddingRight.slice(0, -2)
    let ARatio = 2 / 3

    canvas.setAttribute('width', bodyWidth)
    canvas.setAttribute('height', bodyWidth * ARatio)

    CWidth = bodyWidth
    CHeight = bodyWidth * ARatio
} onResize(); addEventListener('resize', onResize)

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

let stars = []

function legalPos(pos) {
    return !stars.some((star) => (Math.abs(star.x - pos.x) < minGap * star.dist && Math.abs(star.y - pos.y) < minGap * star.dist))
}

function gen() {
    stars = []
    for(let i = 0; i < customization.maxCount; i++) {
        for(let j = 0; j < customization.maxSpawnAttempts; j++) {
            let x = Math.round(1000 * Math.random()) % CWidth
            let y = Math.round(1000 * Math.random()) % CHeight

            if(legalPos({ x: x, y: y }))
                stars.push({ x: x, y: y, dist: Math.random() })
        }
    }

    draw()
} gen()

function sizeAlt(x) {
    return 1 - 0.1 / (0.1 + x) - (0.9091 / 1) * Math.pow(Math.cos(1.5 * (x - 1)), 23)
}

function draw() {
    ctx.clearRect(0, 0, CWidth, CHeight)

    stars.forEach((star) => {   
        ctx.fillStyle = `rgba(255, 255, 255, 1)`
        ctx.strokeStyle = `hsl(${customization.hue}, 100%, 50%)`
        ctx.lineWidth = customization.strokeSize * star.dist
        
        let rotation = (star.x * 31 + star.y * 17 + rotationAlt) % 90
        let Asize = customization.size * star.dist - sizeAlt(rotation % 90 / 90) * 5
        let controlPoint = customization.controlPoint * star.dist
        
        ctx.translate(star.x, star.y)
        ctx.rotate(Math.PI / 180 * rotation)

        // ctx.fillRect(-Asize / 2, -Asize / 2, Asize, Asize)
        // ctx.strokeRect(-Asize / 2, -Asize / 2, Asize, Asize)

        ctx.beginPath()

        ctx.moveTo(Asize / 2, 0)
        ctx.quadraticCurveTo(controlPoint, controlPoint, 0, Asize / 2)

        ctx.quadraticCurveTo(-controlPoint, controlPoint, -Asize / 2, 0)

        ctx.quadraticCurveTo(-controlPoint, -controlPoint, 0, -Asize / 2)

        ctx.quadraticCurveTo(controlPoint, -controlPoint, Asize / 2, 0)

        ctx.fill()
        ctx.stroke()
        
        ctx.rotate(-Math.PI / 180 * rotation)
        ctx.translate(-star.x, -star.y)
    })
}

setInterval(() => {

    rotationAlt = (rotationAlt + customization.rotIncr) % 90

    draw()
}, 10)