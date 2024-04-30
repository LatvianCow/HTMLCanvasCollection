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


// Updates the element values when they're modified in the page by the user
function update() {
    for(let key in customization) {
        customization[key] = Number(document.getElementById(key).value)
    }
    minGap = customization.minGapMult * customization.size
    document.body.style.setProperty('--hue', customization.hue) // Adjusts documents --hue variable which is responsible for border colors
}


const canvas = document.getElementById('kanvas')
let hue = Number(getComputedStyle(document.body).getPropertyValue('--hue')) // Gets the hue value set in the style.css file


// Adjusts canva's width and height paramteres when page is resized
let CWidth, CHeight
function onResize() {
    // Gets style for the element containing the background for the canvas and the canvas
    let bStyle = getComputedStyle(canvas.parentElement.parentElement)

    // Calculates the new size for the canvas
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


// function to check wether given position is not too close to any of the stars
function legalPos(pos) {
    return !stars.some((star) => (Math.abs(star.x - pos.x) < minGap * star.dist && Math.abs(star.y - pos.y) < minGap * star.dist))
}


// Generates new array of stars
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


// Calculates the size alter for star
function sizeAlt(x) {
    return 1 - 0.1 / (0.1 + x) - (0.9091 / 1) * Math.pow(Math.cos(1.5 * (x - 1)), 23)
}


// Draws all of the stars
function draw() {
    ctx.clearRect(0, 0, CWidth, CHeight)

    ctx.fillStyle = `rgba(255, 255, 255, 1)`
    ctx.strokeStyle = `hsl(${customization.hue}, 100%, 50%)`
    stars.forEach((star) => {   
        ctx.lineWidth = customization.strokeSize * star.dist
        
        // Calculates the size rotation and control points for star
        let rotation = (star.x * 31 + star.y * 17 + rotationAlt) % 90
        let Asize = customization.size * star.dist - sizeAlt(rotation % 90 / 90) * 5
        let controlPoint = customization.controlPoint * star.dist
        
        // Translates the star over to its position and rotates it
        ctx.translate(star.x, star.y)
        ctx.rotate(Math.PI / 180 * rotation)

        // Draws the star
        ctx.beginPath()

        ctx.moveTo(Asize / 2, 0)
        ctx.quadraticCurveTo(controlPoint, controlPoint, 0, Asize / 2)

        ctx.quadraticCurveTo(-controlPoint, controlPoint, -Asize / 2, 0)

        ctx.quadraticCurveTo(-controlPoint, -controlPoint, 0, -Asize / 2)

        ctx.quadraticCurveTo(controlPoint, -controlPoint, Asize / 2, 0)

        ctx.fill()
        ctx.stroke()
        
        // Untranslates and unrotates the canvas
        ctx.rotate(-Math.PI / 180 * rotation)
        ctx.translate(-star.x, -star.y)
    })
}


// Star rotater
setInterval(() => {

    rotationAlt = (rotationAlt + customization.rotIncr) % 90

    draw()
}, 10)