declare var require: any
const EventEmitterIMP = require("./EventEmitterImp")

declare interface MultipleEvents {
    [event: string]: any //Function | Function[]
}

declare class EventEmitterDefines {
    getListeners(event: string): Function[];
    getListeners(event: RegExp): { [event: string]: Function };
    addListener(event: string, listener: Function): EventEmitterDefines;
    addListener(event: RegExp, listener: Function): EventEmitterDefines;
    on(event: string, listener: Function): EventEmitterDefines;
    on(event: RegExp, listener: Function): EventEmitterDefines;
    flattenListeners(listeners: { listener: Function }[]): Function[];
    getListenersAsObject(event: string): { [event: string]: Function };
    getListenersAsObject(event: RegExp): { [event: string]: Function };
    addOnceListener(event: string, listener: Function): EventEmitterDefines;
    addOnceListener(event: RegExp, listener: Function): EventEmitterDefines;
    once(event: string, listener: Function): EventEmitterDefines;
    once(event: RegExp, listener: Function): EventEmitterDefines;
    defineEvent(event: string): EventEmitterDefines;
    defineEvents(events: string[]): EventEmitterDefines;
    removeListener(event: string, listener: Function): EventEmitterDefines;
    removeListener(event: RegExp, listener: Function): EventEmitterDefines;
    off(event: string, listener: Function): EventEmitterDefines;
    off(event: RegExp, listener: Function): EventEmitterDefines;
    addListeners(event: string, listeners: Function[]): EventEmitterDefines;
    addListeners(event: RegExp, listeners: Function[]): EventEmitterDefines;
    addListeners(event: MultipleEvents): EventEmitterDefines;
    removeListeners(event: string, listeners: Function[]): EventEmitterDefines;
    removeListeners(event: RegExp, listeners: Function[]): EventEmitterDefines;
    removeListeners(event: MultipleEvents): EventEmitterDefines;
    manipulateListeners(remove: boolean, event: string, listeners: Function[]): EventEmitterDefines;
    manipulateListeners(remove: boolean, event: RegExp, listeners: Function[]): EventEmitterDefines;
    manipulateListeners(remove: boolean, event: MultipleEvents): EventEmitterDefines;
    removeEvent(event?: string): EventEmitterDefines;
    removeEvent(event?: RegExp): EventEmitterDefines;
    removeAllListeners(event?: string): EventEmitterDefines;
    removeAllListeners(event?: RegExp): EventEmitterDefines;
    emitEvent(event: string, ...args: any[]): EventEmitterDefines;
    emitEvent(event: RegExp, ...args: any[]): EventEmitterDefines;
    trigger(event: string, ...args: any[]): EventEmitterDefines;
    trigger(event: RegExp, ...args: any[]): EventEmitterDefines;
    emit(event: string, ...args: any[]): EventEmitterDefines;
    emit(event: RegExp, ...args: any[]): EventEmitterDefines;
    setOnceReturnValue(value: any): EventEmitterDefines;
}

console.log(EventEmitterIMP.EventEmitter)

export const EventEmitter: typeof EventEmitterDefines = EventEmitterIMP.EventEmitter