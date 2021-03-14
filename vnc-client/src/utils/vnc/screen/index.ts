import { Ract } from "typings"

class Screen {
    #canvas: HTMLCanvasElement
    #context: CanvasRenderingContext2D | null
    #onmousedown: any
    #onmouseup: any
    #onmousemove: any

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas
        this.#context = canvas.getContext("2d")
    }

    addMouseHandler = (cb: Function) => {
        let state = 0;
        this.#canvas.addEventListener('mousedown', this.#onmousedown = (e: MouseEvent) => {
            state = 1;
            cb.call(null, e.pageX, e.pageY, state);
            e.preventDefault();
        }, false)
        this.#canvas.addEventListener('mouseup', this.#onmouseup = (e: MouseEvent) => {
            state = 0;
            cb.call(null, e.pageX, e.pageY, state);
            e.preventDefault();
        }, false)
        this.#canvas.addEventListener('mousemove', this.#onmousemove = (e: MouseEvent) => {
            state = 1;
            cb.call(null, e.pageX, e.pageY, state);
            e.preventDefault();
        }, false)
    }

    drawRect = (rect: any) => {
        var img = new Image();
        var self = this;
        img.width = rect.width;
        img.height = rect.height;
        img.src = 'data:image/png;base64,' + rect.image;
        img.onload = function () {
            self.#context!.drawImage(this: , rect.x, rect.y, rect.width, rect.height);
        };
    };

}



export default Screen