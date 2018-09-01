declare var window: any
declare var global: any

if (window.global === undefined) {
    window.global = window;
}

import { UIView } from './uikit/UIView'
global.UIView = UIView

import { UIColor } from './uikit/UIColor'
global.UIColor = UIColor