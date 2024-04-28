// Customization
let size = 25
let strokeSize = 7
let minGap = 3.5 * size
let maxCount = 50
let maxSpawnAttempts = 10


const canvas = document.getElementById('kanvas')
let hue = Number(getComputedStyle(document.body).getPropertyValue('--hue'))

let CWidth, CHeight
function onResize() {
    let bStyle = getComputedStyle(document.body)
    let bodyWidth = bStyle.width.slice(0, -2) - 2 * bStyle.padding.slice(0, -2)
    let ARatio = 2 / 3

    canvas.setAttribute('width', bodyWidth)
    canvas.setAttribute('height', bodyWidth * ARatio)

    CWidth = bodyWidth
    CHeight = bodyWidth * ARatio
} onResize()
addEventListener('resize', onResize)

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

let stars = []

function legalPos(pos) {
    return !stars.some((star) => (Math.abs(star.x - pos.x) < minGap && Math.abs(star.y - pos.y) < minGap))
}

function gen() {
    for(let i = 0; i < maxCount; i++) {
        for(let j = 0; j < maxSpawnAttempts; j++) {
            let x = Math.round(1000 * Math.random()) % CWidth
            let y = Math.round(1000 * Math.random()) % CHeight

            if(legalPos({ x: x, y: y }))
                stars.push({ x: x, y: y, rotation: 0 })
        }
    }

    draw()
} gen()

function sizeAlt(x) {
    return 1 - 0.1 / (0.1 + x) - (0.9091 / 1) * Math.pow(Math.cos(1.5 * (x - 1)), 23)
}

function draw() {
    ctx.clearRect(0, 0, CWidth, CHeight)

    ctx.fillStyle = 'white'
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
    ctx.lineWidth = strokeSize

    stars.forEach((star) => {   
        let rotation = (star.x * 31 + star.y * 17 + star.rotation) % 90
        let Asize = size - sizeAlt(rotation % 90 / 90) * 5
        
        ctx.translate(star.x, star.y)
        ctx.rotate(Math.PI / 180 * rotation)

        ctx.fillRect(-Asize / 2, -Asize / 2, Asize, Asize)
        ctx.strokeRect(-Asize / 2, -Asize / 2, Asize, Asize)
        
        ctx.rotate(-Math.PI / 180 * rotation)
        ctx.translate(-star.x, -star.y)
    })
}

setInterval(() => {
    stars.forEach((star) => {
        star.rotation = (star.rotation + 0.25) % 91
    })
    draw()
}, 10)