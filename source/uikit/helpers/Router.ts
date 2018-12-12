export class Router {

    static shared = new Router

    private routes: { [key: string]: () => void } = {}
    private locked = false

    addListenter() {
        if (!(window.location.hash === "#" || window.location.hash === "")) {
            window.location.hash = ""
        }
        window.addEventListener("hashchange", (e) => {
            if (this.locked) {
                this.locked = false
                return
            }
            const hash = e.oldURL.split("#")[1]
            if (this.routes[hash] !== undefined) {
                this.routes[hash]()
                delete this.routes[hash]
            }
        })
    }

    addRoute(element: any, backface: () => void) {
        const hash = this.createHash()
        element.__hash = hash
        this.routes[hash] = backface
        this.locked = true
        window.location.hash = hash
    }

    popToRoute(element: any) {
        if (element.__hash) {
            window.location.hash = element.__hash
        }
    }

    private createHash() {
        return `xt_router_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}`
    }

}