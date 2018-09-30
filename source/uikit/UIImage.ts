import { UISize, UISizeZero } from "./UISize";
import { EventEmitter } from "../kimi/EventEmitter";

export enum UIImageRenderingMode {
    automatic,
    alwaysOriginal,
    alwaysTemplate,
}

export class UIImage extends EventEmitter {

    readonly imageElement = document.createElement("img")

    readonly renderingMode: UIImageRenderingMode = UIImageRenderingMode.alwaysOriginal

    constructor(options: { name?: string, base64?: string, data?: any, renderingMode?: UIImageRenderingMode }) {
        super()
        if (options.name) {

        }
        else if (options.base64) {
            this.imageElement.src = "data:image;base64," + options.base64
            this.imageElement.addEventListener("load", () => {
                this.size = { width: this.imageElement.width, height: this.imageElement.height }
                this.loaded = true
                this.emit("load")
            })
        }
        if (options.renderingMode) {
            this.renderingMode = this.renderingMode
        }
    }

    static fromURL(url: string): UIImage {
        const image = new UIImage({})
        image.imageElement.src = url
        image.imageElement.addEventListener("load", () => {
            image.size = { width: image.imageElement.width, height: image.imageElement.height }
            image.loaded = true
            image.emit("load")
        })
        return image
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

    private loaded = false

    size: UISize = UISizeZero

    scale: number = 1.0

}