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

    constructor(readonly options: { name?: string, base64?: string, data?: any, renderingMode?: UIImageRenderingMode }) {
        super()
        if (options.base64) {
            this.imageElement.src = "data:image;base64," + options.base64
            this.imageElement.addEventListener("load", () => {
                const scale = options.name ? UIImage.scaleFromName(options.name) : 1.0
                this.size = { width: this.imageElement.naturalWidth / scale, height: this.imageElement.naturalHeight / scale }
                this.scale = scale
                this.loaded = true
                this.emit("load")
            })
        }
        else if (options.name) {

        }
        if (options.renderingMode !== undefined) {
            this.renderingMode = options.renderingMode
        }
    }

    static fromURL(url: string): UIImage {
        const image = new UIImage({})
        image.imageElement.src = url
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

    private loaded = false

    size: UISize = UISizeZero

    scale: number = 1.0

    clone(): UIImage {
        const img = new UIImage(this.options)
        return img
    }

}