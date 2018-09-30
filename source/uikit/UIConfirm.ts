export class UIConfirm {

    constructor(public message: string) {}

    confirmTitle: string = "Yes"
    
    cancelTitle: string = "No"

    show(completed?: () => void, cancelled?: () => void): void {
        if (window.confirm(this.message)) {
            if (completed) {
                completed()
            }
        }
        else {
            if (cancelled) {
                cancelled()
            }
        }
    }

}