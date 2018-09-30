export class UIAlert {

    constructor(public message: String, public buttonText: String = "OK") { }

    show(callback: (() => void) | undefined): void {
        window.alert(this.message)
        if (callback) {
            callback()
        }
    }

}