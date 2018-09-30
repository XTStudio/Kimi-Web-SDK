declare var window: any
declare var global: any

if (window.global === undefined) {
    window.global = window;
}

// UIKit

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

import { UIAlert } from "./uikit/UIAlert";
global.UIAlert = UIAlert

import { UIAnimator } from "./uikit/UIAnimator";
global.UIAnimator = UIAnimator

import { UIButton } from "./uikit/UIButton";
global.UIButton = UIButton

import { UIColor } from './uikit/UIColor'
global.UIColor = UIColor

import { UIConfirm } from "./uikit/UIConfirm";
global.UIConfirm = UIConfirm

import { UIFont } from "./uikit/UIFont";
global.UIFont = UIFont

import { UIGestureRecognizerState, UIGestureRecognizer } from "./uikit/UIGestureRecognizer";
global.UIGestureRecognizerState = UIGestureRecognizerState
global.UIGestureRecognizer = UIGestureRecognizer

import { UIImage } from "./uikit/UIImage";
global.UIImage = UIImage

import { UIImageView } from "./uikit/UIImageView";
global.UIImageView = UIImageView

import { UILabel } from "./uikit/UILabel";
global.UILabel = UILabel

import { UILongPressGestureRecognizer } from "./uikit/UILongPressGestureRecognizer";
global.UILongPressGestureRecognizer = UILongPressGestureRecognizer

import { UIPanGestureRecognizer } from "./uikit/UIPanGestureRecognizer";
global.UIPanGestureRecognizer = UIPanGestureRecognizer

import { UIPinchGestureRecognizer } from "./uikit/UIPinchGestureRecognizer";
global.UIPinchGestureRecognizer = UIPinchGestureRecognizer

import { UIProgressView } from "./uikit/UIProgressView";
global.UIProgressView = UIProgressView

import { UIPrompt } from "./uikit/UIPrompt";
global.UIPrompt = UIPrompt

import { UIRotationGestureRecognizer } from "./uikit/UIRotationGestureRecognizer";
global.UIRotationGestureRecognizer = UIRotationGestureRecognizer

import { UIScreen } from "./uikit/UIScreen";
global.UIScreen = UIScreen

import { UIScrollView } from "./uikit/UIScrollView";
global.UIScrollView = UIScrollView

import { UITapGestureRecognizer } from "./uikit/UITapGestureRecognizer";
global.UITapGestureRecognizer = UITapGestureRecognizer

import { UIView, UIWindow } from './uikit/UIView'
global.UIView = UIView
global.UIWindow = UIWindow

// Foundation

import { DispatchQueue } from "./foundation/DispatchQueue";
global.DispatchQueue = DispatchQueue