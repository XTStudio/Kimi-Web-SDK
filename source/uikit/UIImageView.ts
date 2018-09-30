import { UIView } from "./UIView";
import { UIImage } from "./UIImage";
import { UIViewContentMode } from "./UIEnums";
import { currentAnimationTimeMillis } from "./helpers/Now";

let cachingImages: { [key: string]: UIImage } = {}

export class UIImageView extends UIView {

    contentElement = document.createElement("div")

    constructor() {
        super()
        this.contentElement.style.position = "absolute"
        this.contentElement.style.width = "100%"
        this.contentElement.style.height = "100%"
        this.domElement.appendChild(this.contentElement)
    }

    private _image: UIImage | undefined

    /**
     * Getter image
     * @return {UIImage }
     */
    public get image(): UIImage | undefined {
        return this._image;
    }

    private duringSetImageWithAnimation = false
    private duringSetImageAnimating = false

    /**
     * Setter image
     * @param {UIImage } value
     */
    public set image(value: UIImage | undefined) {
        this.currentURLString = undefined
        this._image = value;
        if (!this.duringSetImageWithAnimation || this.duringSetImageAnimating) {
            this.contentElement.childNodes.forEach(it => {
                this.contentElement.removeChild(it)
            })
        }
        if (value) {
            value.imageElement.style.position = "absolute"
            value.imageElement.style.width = "100%"
            value.imageElement.style.height = "100%"
            this.contentElement.appendChild(value.imageElement)
            this.resetContentObjectFit()
            if (this.duringSetImageWithAnimation) {
                value.imageElement.style.opacity = "0.0"
                value.imageElement.style.webkitTransition = "opacity 0.25s linear"
                value.imageElement.style.transition = "opacity 0.25s linear"
                this.duringSetImageWithAnimation = true
                setTimeout(() => {
                    value.imageElement.style.opacity = "1.0"
                    setTimeout(() => {
                        value.imageElement.style.webkitTransition = null
                        value.imageElement.style.transition = null
                        this.contentElement.childNodes.forEach(it => {
                            if (it != value.imageElement) {
                                this.contentElement.removeChild(it)
                            }
                        })
                        this.duringSetImageWithAnimation = false
                    }, 250)
                }, 0)
            }
        }
    }

    private currentURLString: string | undefined = undefined

    public loadImageWithURLString(URLString?: string, placeholder?: UIImage): void {
        if (URLString !== undefined && cachingImages[URLString] === undefined) {
            this.image = placeholder
        }
        this.currentURLString = URLString
        if (URLString) {
            setTimeout(() => {
                if (this.currentURLString === URLString) {
                    const image = cachingImages[URLString] || UIImage.fromURL(URLString)
                    const startTime = currentAnimationTimeMillis()
                    image.fetchSize().then(() => {
                        cachingImages[URLString] = image
                        if (this.currentURLString === URLString) {
                            const endTime = currentAnimationTimeMillis()
                            if (endTime - startTime < 1 || this.image === undefined) {
                                this.image = image
                            }
                            else {
                                this.duringSetImageWithAnimation = true
                                this.image = image
                                this.duringSetImageWithAnimation = false
                            }
                        }
                    })
                }
            })
        }
    }

    public get contentMode(): UIViewContentMode {
        return this._contentMode;
    }

    public set contentMode(value: UIViewContentMode) {
        this._contentMode = value
        this.resetContentObjectFit()
    }

    private resetContentObjectFit() {
        if (this.image) {
            switch (this.contentMode) {
                case UIViewContentMode.scaleAspectFit:
                    this.image.imageElement.style.setProperty("object-fit", "contain")
                    break
                case UIViewContentMode.scaleAspectFill:
                    this.image.imageElement.style.setProperty("object-fit", "cover")
                    break
                case UIViewContentMode.scaleToFill:
                    this.image.imageElement.style.setProperty("object-fit", "fill")
                    break
            }
        }
    }

}