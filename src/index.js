import './styles.scss';
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import './libs/svg.connectable'
import { followPath } from './animate'

class Diagram {
    constructor() {
        this.draw = SVG().addTo('#container').size('100%', '100%')

        this.startBtn = document.getElementById('start-btn')
        this.elemRectBtn = document.getElementById('elem-rect')
        this.actConnBtn = document.getElementById('act-connect')

        this.elements = []

        this.connectingElements = false
        this.rectCount = 0
        this.elementsToConnect = []
        this.connections = []

        this.circle = this.draw.circle(20).hide()

        this.actConnBtn.onclick = () => {
            console.log(this.rectCount)
            if (this.rectCount < 2) {
                alert('You need at least two elements')
            } else {
                this.connectingElements = true
            }
        }

        this.elemRectBtn.onclick = () => {
            this.rectCount++
            this.createRectWithEmptyText(200, 200)
        }

        this.startBtn.onclick = () => {
            this.circle.show()
            // we use connections[0] for testing
            followPath(this.circle, this.connections[0].connection.connector)
        }

        this.draw.image('https://upload.wikimedia.org/wikipedia/commons/5/5c/AWS_Simple_Icons_AWS_Cloud.svg').size(150, 150).draggable()
    }

    createRectWithEmptyText(width, height) {
        const rect = this.draw.rect(width, height).fill('#f06').draggable()
        
        const element = {
            type: 'rect',
            label: this.draw.text('').font('size', '26px'),
            elem: rect
        }

        rect.dblclick(() => {
            const text = prompt('Enter the element name', element.label.text());
            element.label.text(text || '')

            const rb = rect.bbox()
            element.label.center(rb.cx, rb.cy)
        })

        rect.click(() => {
            if (this.connectingElements) {
                this.elementsToConnect.push(rect)

                if (this.elementsToConnect.length === 2) {
                    this.connectingElements = false
                    this.connectElements(this.elementsToConnect)
                }
            }
        })

        rect.mouseover(() => {
            if (this.connectingElements) {
                rect.stroke({ color: 'blue', width: 3, dasharray: 20 })
            }
        })

        rect.mouseout(() => {
            rect.stroke('none')
        })

        rect.on('dragmove', e => {
            const { box } = e.detail
            element.label.center(box.cx, box.cy)
        })

        this.elements.push(element)
    }

    connectElements(elements) {
        const [source, target] = elements

        // https://jsfiddle.net/L2sjjc3b/80/
        const connection = source.connectable({
            container: this.draw.group(),
            markers: this.draw.group(),
            marker: 'default',
            sourceAttach: 'perifery',
            targetAttach: 'perifery',
        }, target)

        const t = this.draw.textPath('api integration', connection.connector)

        positionText()

        connection.connector.dblclick(() => {
            const text = prompt('Enter a description', t.text());
            t.text(text)
            positionText()
        })

        this.connections.push({
            source,
            target,
            connection
        })

        function positionText() {
            t.cx(connection.connector.cx())
        }

        // TODO: debug and fix me: The text disappears due to 
        // a very large "cx" after certain moves of the source/target element
        // source.on('dragend', positionText)
        // target.on('dragend', positionText)
    }
}

window.diagram = new Diagram()


//
// const serviceA= createRectWithText(200, 200, 'Service A')
// const serviceB = createRectWithText(200, 200, 'Service B')

// const kafka = draw.image('https://upload.wikimedia.org/wikipedia/commons/5/5c/AWS_Simple_Icons_AWS_Cloud.svg').size(150, 150).draggable()


// function createRectWithText(width, height, text) {
//     const g = draw.group()
//     const r = g.rect(width, height).fill('#f06')
//     const t = g.text(text)
//
//     t.font('size', '26px')
//
//
//
//     g.draggable()
//
//
//     return g
// }

// // https://jsfiddle.net/L2sjjc3b/80/
// const r = serviceA.connectable({
//     container: draw.group(),
//     markers: draw.group(),
//     marker: 'default',
//     sourceAttach: 'perifery',
//     targetAttach: 'perifery',
// }, serviceB)
// //
// const descText = draw.textPath('API integration', r.connector)
// descText.cx(r.connector.cx())
// const circle = draw.circle(20).hide()
//


// const constraints = new Box(0, 0, 2000, 1000)
// rect.on('dragmove.namespace', e => {
//     const { handler, box } = e.detail
//     e.preventDefault()
//
//     let { x, y } = box
//
//     // In case your dragged element is a nested element,
//     // you are better off using the rbox() instead of bbox()
//
//     if (x < constraints.x) {
//         x = constraints.x
//     }
//
//     if (y < constraints.y) {
//         y = constraints.y
//     }
//
//     if (box.x2 > constraints.x2) {
//         x = constraints.x2 - box.w
//     }
//
//     if (box.y2 > constraints.y2) {
//         y = constraints.y2 - box.h
//     }
//
//     handler.move(x - (x % 50), y - (y % 50))
// })
//
