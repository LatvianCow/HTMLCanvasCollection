const canvas = document.getElementById('kanvas')


// Adjusts canva's size to take up full width of its parent element
let rect, CWidth, CHeight
function onResize() {
    let pStyle = getComputedStyle(canvas.parentElement)
    let pWidth = pStyle.width.slice(0, -2) - pStyle.paddingLeft.slice(0, -2) - pStyle.paddingRight.slice(0, -2)
    let aspectRatio = 1 / 2

    CWidth = pWidth
    CHeight = pWidth * aspectRatio
    
    canvas.setAttribute('width', CWidth)
    canvas.setAttribute('height', CHeight)

    rect = canvas.getBoundingClientRect()
} onResize(); addEventListener('resize', onResize); addEventListener('scroll', onResize)


// function, which returns based off of x
function shapeAnim(x) {
    return Math.abs(
        Math.pow(-x, 9) - Math.pow(1 / (x + 1.4), 5) + 1.05
    )
}


/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
let hue = Number(getComputedStyle(document.body).getPropertyValue('--hue'))

// Default customization values
let maxWidth = 300
let aspect1 = 1
let aspect2 = 1
let aspectRatio = aspect1 / aspect2 // width / height
let shapeStrokeWidth = 10
let cShape = 'rectangle' // 0 = rectangle | 1 = circle
let step = 50
let delay = 5

document.getElementById('Aspect1').value = aspect1
document.getElementById('Aspect2').value = aspect2
document.getElementById('maxWidth').value = maxWidth
document.getElementById('strokeWidth').value = shapeStrokeWidth
document.getElementById('shape').value = cShape
document.getElementById('step').value = step
document.getElementById('delay').value = delay
document.getElementById('hue').value = hue


let activeShapes = []

// Registers a new shape
addEventListener('mouseup', (event) => {
    // Adjusts mouse's x and y position to be relative to the canvas element
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    // Checks if x and y values are inside of the canvas elements
    if(x >= 0 && x <= CWidth && y >= 0 && y <= CHeight){
        activeShapes.push({
            x: x,
            y: y,
            shape: cShape,
            size: 0
        })
    }
})


function progressShapes() {
    // smol optimization
    if(activeShapes.length == 0)
        return

    // Increments size paramater for each shape in active Shapes array
    activeShapes.forEach((shape) => {
        shape.size += 0.01
    })

    // Gets rid of the shapes with size of 100 or more
    let newActiveShapes = []
    for(let i = 0; i < activeShapes.length; i++) {
        if(activeShapes[i].size < 1.168) 
            newActiveShapes.push(activeShapes[i])
    }

    activeShapes = newActiveShapes
}


setInterval(() => {
    ctx.clearRect(0, 0, CWidth, CHeight)

    ctx.lineWidth = shapeStrokeWidth

    // Draws all of the shapes
    activeShapes.forEach((shape) => {
        let koef = shapeAnim(shape.size)

        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${(1 - koef) * 100}%)`

        let vidth = maxWidth * koef
        let haigth = maxWidth / aspectRatio * koef

        switch(shape.shape) {
            case 'rectangle':
                ctx.strokeRect(shape.x - vidth / 2, shape.y - haigth / 2, vidth, haigth)
                break
            case 'circle': // Circle
                ctx.beginPath()

                ctx.arc(shape.x, shape.y, vidth / 2, 0, Math.PI * 2)

                ctx.stroke()
                break
        }
    })

    progressShapes()
}, 20)


// Executes "The thing"
function execute() {
    for(let i = 0; i < CWidth; i += step) {
        setTimeout(() => {
            activeShapes.push({
                x: i,
                y: CHeight / 2,
                shape: cShape,
                size: 0
            }, 100)
        }, i / step * delay)
    }
}


// Updates values whenever user inputs something
function updateVal() {
    // Makes sure that there are no negative values, if there are makes those zero
    document.getElementById('Aspect1').value = Math.max(Number(document.getElementById('Aspect1').value), 0)
    document.getElementById('Aspect2').value = Math.max(Number(document.getElementById('Aspect2').value), 0)
    document.getElementById('maxWidth').value = Math.max(Number(document.getElementById('maxWidth').value), 0)
    document.getElementById('strokeWidth').value = Math.max(Number(document.getElementById('strokeWidth').value), 0)
    document.getElementById('step').value = Math.max(Number(document.getElementById('step').value), 0)
    document.getElementById('delay').value = Math.max(Number(document.getElementById('delay').value), 0)

    // Applies the new values
    aspect1 = Number(document.getElementById('Aspect1').value)
    aspect2 = Number(document.getElementById('Aspect2').value)
    aspectRatio = aspect1 / aspect2
    maxWidth = Number(document.getElementById('maxWidth').value)
    shapeStrokeWidth = Number(document.getElementById('strokeWidth').value)
    cShape = document.getElementById('shape').value
    step = Number(document.getElementById('step').value)
    delay = Number(document.getElementById('delay').value)
    hue = Number(document.getElementById('hue').value)
    document.body.style.setProperty('--hue', hue)
}