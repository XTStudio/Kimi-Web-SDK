import { UUID } from "../foundation/UUID";

export class UIDevice {

    static readonly current: UIDevice = new UIDevice

    readonly name: string = "Browser"
    readonly model: string = "Browser"
    readonly systemName: string = "Web"
    readonly systemVersion: string = "1.0.0"
    readonly identifierForVendor: UUID

    constructor() {
        const idfv = localStorage.getItem("com.xt.identifierForVendor")
        if (typeof idfv === "string") {
            this.identifierForVendor = new UUID(idfv)
        }
        else {
            this.identifierForVendor = new UUID()
            localStorage.setItem("com.xt.identifierForVendor", this.identifierForVendor.UUIDString)
        }
    }

}