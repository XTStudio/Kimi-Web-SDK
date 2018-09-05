declare var window: any
declare var global: any

if (window.global === undefined) {
    window.global = window;
}

import { UIViewContentMode, UIControlState, UIControlContentVerticalAlignment, UIControlContentHorizontalAlignment, UITextAlignment, UILineBreakMode, UITextFieldViewMode, UITextAutocapitalizationType, UITextAutocorrectionType, UITextSpellCheckingType, UIKeyboardType, UIReturnKeyType, UILayoutConstraintAxis, UIStackViewDistribution, UIStackViewAlignment, UIStatusBarStyle } from "./uikit/UIEnums";
global.UIViewContentMode = UIViewContentMode
global.UIControlState = UIControlState
global.UIControlContentVerticalAlignment = UIControlContentVerticalAlignment
global.UIControlContentHorizontalAlignment = UIControlContentHorizontalAlignment
global.UITextAlignment = UITextAlignment
global.UILineBreakMode = UILineBreakMode
global.UITextFieldViewMode = UITextFieldViewMode
global.UITextAutocapitalizationType = UITextAutocapitalizationType
global.UITextAutocorrectionType = UITextAutocorrectionType
global.UITextSpellCheckingType = UITextSpellCheckingType
global.UIKeyboardType = UIKeyboardType
global.UIReturnKeyType = UIReturnKeyType
global.UILayoutConstraintAxis = UILayoutConstraintAxis
global.UIStackViewDistribution = UIStackViewDistribution
global.UIStackViewAlignment = UIStackViewAlignment
global.UIStatusBarStyle = UIStatusBarStyle

import { UIView, UIWindow } from './uikit/UIView'
global.UIView = UIView
global.UIWindow = UIWindow

import { UIGestureRecognizerState, UIGestureRecognizer } from "./uikit/UIGestureRecognizer";
global.UIGestureRecognizerState = UIGestureRecognizerState
global.UIGestureRecognizer = UIGestureRecognizer

import { UIColor } from './uikit/UIColor'
global.UIColor = UIColor

import { DispatchQueue } from "./foundation/DispatchQueue";
global.DispatchQueue = DispatchQueue