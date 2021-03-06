import { UIView } from "./UIView";
import { UIImage, UIImageRenderingMode } from "./UIImage";
import { UIViewContentMode } from "./UIEnums";
import { currentAnimationTimeMillis } from "./helpers/Now";
import { UISize, UISizeZero } from "./UISize";
import { IdelQueue } from "./helpers/IdelQueue";

const svgFilterRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg")
const templateElement = document.createElement("template")
document.getElementsByTagName("html")[0].appendChild(templateElement)
templateElement.appendChild(svgFilterRoot)

export class UIImageView extends UIView {

    contentElement = document.createElement("div")

    constructor() {
        super()
        this.userInteractionEnabled = false
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
    public set image(aValue: UIImage | undefined) {
        if (this._image === aValue || (this._image && aValue && this._image.imageKey !== undefined && this._image.imageKey === aValue.imageKey && this._image.renderingMode === aValue.renderingMode)) {
            return
        }
        let value: UIImage | undefined = aValue
        if (value && value.imageElement.parentElement instanceof HTMLElement) {
            value = value.dequeue()
        }
        this.currentURLString = undefined
        this._image = value;
        if (!this.duringSetImageWithAnimation || this.duringSetImageAnimating) {
            this.contentElement.innerHTML = ''
        }
        if (value) {
            value.imageElement.style.position = "absolute"
            value.imageElement.style.width = "100%"
            value.imageElement.style.height = "100%"
            value.imageElement.style.borderRadius = this.domElement.style.borderRadius
            this.contentElement.appendChild(value.imageElement)
            this.resetContentObjectFit()
            if (this.duringSetImageWithAnimation) {
                value.imageElement.style.opacity = "0.0"
                value.imageElement.style.webkitTransition = "opacity 0.25s linear"
                value.imageElement.style.transition = "opacity 0.25s linear"
                this.duringSetImageWithAnimation = true
                setTimeout(() => {
                    if (value) {
                        value.imageElement.style.opacity = "1.0"
                    }
                    setTimeout(() => {
                        if (value) {
                            value.imageElement.style.webkitTransition = null
                            value.imageElement.style.transition = null
                            this.contentElement.childNodes.forEach(it => {
                                if (value && it != value.imageElement) {
                                    this.contentElement.removeChild(it)
                                }
                            })
                        }
                        this.duringSetImageWithAnimation = false
                    }, 250)
                }, 32)
            }
        }
        this.createTintFilter()
        if (this.requireLayoutApplingAfterContentChanged) {
            this.layoutController.apply()
        }
    }

    private currentURLString: string | undefined = undefined
    private loadImageHandler: any = undefined

    public loadImageWithURLString(URLString?: string, placeholder?: UIImage): void {
        this.image = placeholder
        this.currentURLString = URLString
        IdelQueue.shared.cancel(this.loadImageHandler)
        if (URLString) {
            this.loadImageHandler = IdelQueue.shared.add(() => {
                if (this.currentURLString === URLString) {
                    const image = UIImage.fromURL(URLString)
                    image.fetchSize().then(() => {
                        if (this.currentURLString === URLString) {
                            this.duringSetImageWithAnimation = true
                            this.image = image
                            this.duringSetImageWithAnimation = false
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

    tintColorDidChange() {
        super.tintColorDidChange()
        this.createTintFilter()
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

    private filterElement: SVGFilterElement | undefined = undefined

    didRemovedFromWindow() {
        super.didRemovedFromWindow()
        if (this.filterElement) {
            svgFilterRoot.removeChild(this.filterElement)
        }
    }

    private createTintFilter() {
        if (this.image && this.image.renderingMode === UIImageRenderingMode.alwaysTemplate) {
            if (this.filterElement) {
                svgFilterRoot.removeChild(this.filterElement)
            }
            const filterUUID = "com.xt.filter." + Math.random() + Math.random()
            const filterElement = document.createElementNS("http://www.w3.org/2000/svg", "filter")
            filterElement.id = filterUUID
            filterElement.innerHTML = `
            <feColorMatrix in="SourceGraphic"
                        type="matrix"
                        values="0 0 0 0 ${this.tintColor.r}
                                0 0 0 0 ${this.tintColor.g}
                                0 0 0 0 ${this.tintColor.b} 
                                0 0 0 ${this.tintColor.a} 0" />
            `
            svgFilterRoot.appendChild(filterElement)
            this.filterElement = filterElement
            this.image.imageElement.style.filter = `url(#${filterUUID})`
        }
    }

    intrinsicContentSize(width: number | undefined = undefined): UISize {
        if (this.image) {
            if (width !== undefined && this.image.size.width > width) {
                return {
                    width: width,
                    height: (width / this.image.size.width) * this.image.size.height
                }
            }
            else {
                return this.image.size
            }
        }
        return UISizeZero
    }

}