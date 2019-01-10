declare var global: any

interface UIReloadItem {
    clazz: any;
    superItem: UIReloadItem | undefined;
}

export class UIReloader {
    static shared = new UIReloader
    items: { [key: string]: UIReloadItem } = {}
    instances: { [key: string]: any[] } = {}
}

global.UIReloader = UIReloader

export const UIReload = function <T>(reloadIdentifier: string, reloadCallback: (owner: any) => any | void) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        if (UIReloader.shared.items[reloadIdentifier] !== undefined) {
            const reloadingItem = UIReloader.shared.items[reloadIdentifier]
            if (reloadingItem) {
                const oldTarget = reloadingItem.clazz
                const newTarget = arguments[0].prototype
                for (const key in newTarget) {
                    if (newTarget.hasOwnProperty(key)) {
                        oldTarget[key] = newTarget[key]
                    }
                }
            }
            if (UIReloader.shared.instances[reloadIdentifier]) {
                UIReloader.shared.instances[reloadIdentifier].forEach(it => reloadCallback(it))
            }
        }
        else {
            let rootItem: UIReloadItem = { clazz: arguments[0].prototype, superItem: undefined }
            let currentItem: UIReloadItem | undefined = rootItem
            let current = arguments[0].prototype
            while (current !== undefined && current !== null && current.__proto__ !== undefined && currentItem !== undefined) {
                currentItem.superItem = { clazz: current.__proto__, superItem: undefined }
                current = current.__proto__
                currentItem = currentItem.superItem
            }
            UIReloader.shared.items[reloadIdentifier] = rootItem
        }
        return class extends constructor {
            constructor(...rest: any[]) {
                super(...rest)
                if (UIReloader.shared.instances[reloadIdentifier] === undefined) {
                    UIReloader.shared.instances[reloadIdentifier] = []
                }
                UIReloader.shared.instances[reloadIdentifier].push(this)
            }
        }
    }
}