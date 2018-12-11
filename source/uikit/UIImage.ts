import { UISize, UISizeZero } from "./UISize";
import { EventEmitter } from "../kimi/EventEmitter";
import { Data } from "../foundation/Data";

export enum UIImageRenderingMode {
    automatic,
    alwaysOriginal,
    alwaysTemplate,
}

const imageQueue: { [key: string]: UIImage[] } = {}

export class UIImage extends EventEmitter {

    readonly imageElement = document.createElement("img")
    imageKey: string | undefined

    renderingMode: UIImageRenderingMode = UIImageRenderingMode.alwaysOriginal

    constructor(readonly options: { name?: string, base64?: string, data?: Data, renderingMode?: UIImageRenderingMode }, cloner: UIImage | undefined = undefined) {
        super()
        if (options.base64) {
            this.imageElement.src = "data:image;base64," + options.base64
            this.imageKey = options.name
            if (cloner && cloner.loaded) { return }
            this.imageElement.addEventListener("load", () => {
                const scale = options.name ? UIImage.scaleFromName(options.name) : 1.0
                this.size = { width: this.imageElement.naturalWidth / scale, height: this.imageElement.naturalHeight / scale }
                this.scale = scale
                this.loaded = true
                this.emit("load")
            })
        }
        else if (options.data) {
            this.imageElement.src = "data:image;base64," + options.data.base64EncodedString()
            this.imageKey = options.name
            if (cloner && cloner.loaded) { return }
            this.imageElement.addEventListener("load", () => {
                const scale = options.name ? UIImage.scaleFromName(options.name) : 1.0
                this.size = { width: this.imageElement.naturalWidth / scale, height: this.imageElement.naturalHeight / scale }
                this.scale = scale
                this.loaded = true
                this.emit("load")
            })
        }
        else if (options.name) {
            this.imageElement.src = `./assets/images/${options.name}@2x.png`
            this.imageKey = options.name
            if (cloner && cloner.loaded) { return }
            this.imageElement.addEventListener("load", () => {
                this.size = { width: this.imageElement.naturalWidth / 2.0, height: this.imageElement.naturalHeight / 2.0 }
                this.scale = 2.0
                this.loaded = true
                this.emit("load")
            })
        }
        if (options.renderingMode !== undefined) {
            this.renderingMode = options.renderingMode
        }
    }

    static fromURL(url: string): UIImage {
        const image = new UIImage({})
        image.imageElement.src = url
        image.imageKey = url
        image.imageElement.addEventListener("load", () => {
            image.size = { width: image.imageElement.naturalWidth, height: image.imageElement.naturalHeight }
            image.loaded = true
            image.emit("load")
        })
        return image
    }

    static scaleFromName(name: string): number {
        if (name.indexOf("@2x") > 0) {
            return 2.0
        }
        else if (name.indexOf("@3x") > 0) {
            return 3.0
        }
        else if (name.indexOf("@4x") > 0) {
            return 4.0
        }
        return 1.0
    }

    async fetchSize(): Promise<UISize> {
        if (this.loaded) {
            return this.size
        }
        else {
            return await new Promise<UISize>((resolver, rejector) => {
                this.on("load", () => {
                    resolver(this.size)
                })
            })
        }
    }

    loaded = false

    size: UISize = UISizeZero

    scale: number = 1.0

    clone(): UIImage {
        const img = new UIImage(this.options, this)
        img.size = this.size
        img.scale = this.scale
        img.loaded = this.loaded
        img.renderingMode = this.renderingMode
        return img
    }

    dequeue(): UIImage {
        if (this.imageKey) {
            if (imageQueue[this.imageKey] === undefined) {
                imageQueue[this.imageKey] = []
            }
            for (let index = 0; index < imageQueue[this.imageKey].length; index++) {
                const element = imageQueue[this.imageKey][index];
                if (element.imageElement.parentElement === null) {
                    return element
                }
            }
            const newNode = this.clone()
            imageQueue[this.imageKey].push(newNode)
            return newNode
        }
        return this.clone()
    }

}