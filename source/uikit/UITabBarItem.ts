import { UIEdgeInsets, UIEdgeInsetsZero } from "./UIEdgeInsets";
import { UIImage } from "./UIImage";
import { UITabBarButton } from "./UITabBar";

export class UITabBarItem {

    private _title: string | undefined = undefined

    public get title(): string | undefined {
        return this._title;
    }

    public set title(value: string | undefined) {
        this._title = value;
        if (this.barButton) {
            this.barButton.setNeedUpdate()
        }
    }

    private _image: UIImage | undefined = undefined

    public get image(): UIImage | undefined {
        return this._image;
    }

    public set image(value: UIImage | undefined) {
        this._image = value;
        if (this.barButton) {
            this.barButton.setNeedUpdate()
        }
    }

    private _selectedImage: UIImage | undefined = undefined

    public get selectedImage(): UIImage | undefined {
        return this._selectedImage;
    }

    public set selectedImage(value: UIImage | undefined) {
        this._selectedImage = value;
        if (this.barButton) {
            this.barButton.setNeedUpdate()
        }
    }

    private _imageInsets: UIEdgeInsets = UIEdgeInsetsZero

    public get imageInsets(): UIEdgeInsets {
        return this._imageInsets;
    }

    public set imageInsets(value: UIEdgeInsets) {
        this._imageInsets = value;
        if (this.barButton) {
            this.barButton.setNeedUpdate()
        }
    }

    // Implementation

    barButton: UITabBarButton | undefined = undefined

}