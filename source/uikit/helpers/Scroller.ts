/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { currentAnimationTimeMillis } from "./Now";

class ViscousFluidInterpolator {

    static VISCOUS_FLUID_SCALE: number = 8.0;
    static VISCOUS_FLUID_NORMALIZE: number;
    static VISCOUS_FLUID_OFFSET: number;

    static viscousFluid(x: number): number {
        x *= ViscousFluidInterpolator.VISCOUS_FLUID_SCALE;
        if (x < 1.0) {
            x -= (1.0 - Math.exp(-x));
        } else {
            const start = 0.36787944117;   // 1/e == exp(-1)
            x = 1.0 - Math.exp(1.0 - x);
            x = start + x * (1.0 - start);
        }
        return x;
    }

    public getInterpolation(input: number): number {
        const interpolated = ViscousFluidInterpolator.VISCOUS_FLUID_NORMALIZE * ViscousFluidInterpolator.viscousFluid(input);
        if (interpolated > 0) {
            return interpolated + ViscousFluidInterpolator.VISCOUS_FLUID_OFFSET;
        }
        return interpolated;
    }
}

{
    ViscousFluidInterpolator.VISCOUS_FLUID_NORMALIZE = 1.0 / ViscousFluidInterpolator.viscousFluid(1.0);
    ViscousFluidInterpolator.VISCOUS_FLUID_OFFSET = 1.0 - ViscousFluidInterpolator.VISCOUS_FLUID_NORMALIZE * ViscousFluidInterpolator.viscousFluid(1.0);
}

export class Scroller {

    interpolator: any;
    mode: number = 0;
    startX: number = 0
    startY: number = 0
    finalX: number = 0
    finalY: number = 0
    minX: number = 0
    maxX: number = 0
    minY: number = 0
    maxY: number = 0
    currX: number = 0
    currY: number = 0
    startTime: number = 0;
    duration: number = 0
    durationReciprocal: number = 0.0
    deltaX: number = 0.0
    deltaY: number = 0.0
    finished: boolean = false
    flywheel: boolean = false
    velocity: number = 0.0
    currVelocity: number = 0.0
    distance: number = 0
    flingFriction = 0.015
    static DEFAULT_DURATION: number = 250;
    static SCROLL_MODE: number = 0;
    static FLING_MODE: number = 1;
    static DECELERATION_RATE: number = (Math.log(0.78) / Math.log(0.9));
    static INFLEXION: number = 0.35; // Tension lines cross at (INFLEXION, 1)
    static START_TENSION: number = 0.5;
    static END_TENSION: number = 1.0;
    static P1: number = Scroller.START_TENSION * Scroller.INFLEXION;
    static P2: number = 1.0 - Scroller.END_TENSION * (1.0 - Scroller.INFLEXION);
    static NB_SAMPLES: number = 100;
    static SPLINE_POSITION: number[] = [];
    static SPLINE_TIME: number[] = [];
    deceleration: number = 0.0
    physicalCoeff: number = 0.0

    constructor() {
        this.finished = true;
        this.interpolator = new ViscousFluidInterpolator();
        this.deceleration = this.computeDeceleration(0.015);
        this.physicalCoeff = this.computeDeceleration(0.84); // look and feel tuning
    }

    public setFriction(friction: number) {
        this.deceleration = this.computeDeceleration(friction);
        this.flingFriction = friction;
    }

    private computeDeceleration(friction: number) {
        return 9.80665   // g (m/s^2)
            * 39.37               // inch/meter
            * 160.0
            * friction;
    }

    public forceFinished(finished: boolean) {
        this.finished = finished;
    }

    public getCurrVelocity(): number {
        return this.mode == Scroller.FLING_MODE ?
            this.currVelocity : this.velocity - this.deceleration * this.timePassed() / 2000.0;
    }

    public computeScrollOffset(): boolean {
        if (this.finished) {
            return false;
        }
        const timePassed = (currentAnimationTimeMillis() - this.startTime);
        if (timePassed < this.duration) {
            switch (this.mode) {
                case Scroller.SCROLL_MODE:
                    const x = this.interpolator.getInterpolation(timePassed * this.durationReciprocal);
                    this.currX = this.startX + Math.round(x * this.deltaX);
                    this.currY = this.startY + Math.round(x * this.deltaY);
                    break;
                case Scroller.FLING_MODE:
                    const t = timePassed / this.duration;
                    const index = Math.floor((Scroller.NB_SAMPLES * t));
                    let distanceCoef = 1;
                    let velocityCoef = 0;
                    if (index < Scroller.NB_SAMPLES) {
                        const t_inf = index / Scroller.NB_SAMPLES;
                        const t_sup = (index + 1) / Scroller.NB_SAMPLES;
                        const d_inf = Scroller.SPLINE_POSITION[index];
                        const d_sup = Scroller.SPLINE_POSITION[index + 1];
                        velocityCoef = (d_sup - d_inf) / (t_sup - t_inf);
                        distanceCoef = d_inf + (t - t_inf) * velocityCoef;
                    }
                    this.currVelocity = velocityCoef * this.distance / (this.duration * 1000.0);
                    this.currX = this.startX + Math.round(distanceCoef * (this.finalX - this.startX));
                    // Pin to mMinX <= this.CurrX<= mMaxX
                    this.currX = Math.min(this.currX, this.maxX);
                    this.currX = Math.max(this.currX, this.minX);

                    this.currY = this.startY + Math.round(distanceCoef * (this.finalY - this.startY));
                    // Pin to mMinY <= this.CurrY  <= mMaxY
                    this.currY = Math.min(this.currY, this.maxY);
                    this.currY = Math.max(this.currY, this.minY);
                    if (this.currX == this.finalX && this.currY == this.finalY) {
                        this.finished = true;
                    }
                    break;
            }
        }
        else {
            this.currX = this.finalX;
            this.currY = this.finalY;
            this.finished = true;
        }
        return true;
    }

    public startScroll(startX: number, startY: number, dx: number, dy: number, duration: number = Scroller.DEFAULT_DURATION): void {
        this.mode = Scroller.SCROLL_MODE;
        this.finished = false;
        this.duration = duration;
        this.startTime = currentAnimationTimeMillis()
        this.startX = startX;
        this.startY = startY;
        this.finalX = startX + dx;
        this.finalY = startY + dy;
        this.deltaX = dx;
        this.deltaY = dy;
        this.durationReciprocal = 1.0 / this.duration;
    }

    public fling(startX: number, startY: number, velocityX: number, velocityY: number,
        minX: number, maxX: number, minY: number, maxY: number): void {
        // Continue a scroll or fling in progress
        this.mode = Scroller.FLING_MODE;
        this.finished = false;
        const velocity = Math.hypot(velocityX, velocityY);

        this.velocity = velocity;
        this.duration = this.getSplineFlingDuration(velocity);
        this.startTime = currentAnimationTimeMillis();
        this.startX = startX;
        this.startY = startY;
        const coeffX = velocity == 0 ? 1.0 : velocityX / velocity;
        const coeffY = velocity == 0 ? 1.0 : velocityY / velocity;
        const totalDistance = this.getSplineFlingDistance(velocity);
        this.distance = (totalDistance * Math.sign(velocity));

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.finalX = startX + Math.round(totalDistance * coeffX);
        // Pin to mMinX <= mFinalX <= mMaxX
        this.finalX = Math.min(this.finalX, this.maxX);
        this.finalX = Math.max(this.finalX, this.minX);

        this.finalY = startY + Math.round(totalDistance * coeffY);
        // Pin to mMinY <= mFinalY <= mMaxY
        this.finalY = Math.min(this.finalY, this.maxY);
        this.finalY = Math.max(this.finalY, this.minY);
    }

    getSplineDeceleration(velocity: number): number {
        return Math.log(Scroller.INFLEXION * Math.abs(velocity) / (this.flingFriction * this.physicalCoeff));
    }

    getSplineFlingDuration(velocity: number): number {
        const l = this.getSplineDeceleration(velocity);
        const decelMinusOne = Scroller.DECELERATION_RATE - 1.0;
        return (1000.0 * Math.exp(l / decelMinusOne));
    }

    getSplineFlingDistance(velocity: number): number {
        const l = this.getSplineDeceleration(velocity);
        const decelMinusOne = Scroller.DECELERATION_RATE - 1.0;
        return this.flingFriction * this.physicalCoeff * Math.exp(Scroller.DECELERATION_RATE / decelMinusOne * l);
    }

    public abortAnimation(): void {
        this.currX = this.finalX;
        this.currY = this.finalY;
        this.finished = true;
    }

    public extendDuration(extend: number): void {
        const passed = this.timePassed();
        this.duration = passed + extend;
        this.durationReciprocal = 1.0 / this.duration;
        this.finished = false;
    }

    public timePassed(): number {
        return currentAnimationTimeMillis() - this.startTime;
    }

    public setFinalX(newX: number): void {
        this.finalX = newX;
        this.deltaX = this.finalX - this.startX;
        this.finished = false;
    }

    public setFinalY(newY: number): void {
        this.finalY = newY;
        this.deltaY = this.finalY - this.startY;
        this.finished = false;
    }

    public isScrollingInDirection(xvel: number, yvel: number): boolean {
        return !this.finished && Math.sign(xvel) == Math.sign(this.finalX - this.startX) &&
            Math.sign(yvel) == Math.sign(this.finalY - this.startY);
    }

}

{
    let x_min = 0.0;
    let y_min = 0.0;
    for (var i = 0; i < Scroller.NB_SAMPLES; i++) {
        let alpha = i / Scroller.NB_SAMPLES;
        let x_max = 1.0;
        let x = 0.0, tx = 0.0, coef = 0.0;
        while (true) {
            x = x_min + (x_max - x_min) / 2.0;
            coef = 3.0 * x * (1.0 - x);
            tx = coef * ((1.0 - x) * Scroller.P1 + x * Scroller.P2) + x * x * x;
            if (Math.abs(tx - alpha) < 1E-5) break;
            if (tx > alpha) x_max = x;
            else x_min = x;
        }
        Scroller.SPLINE_POSITION[i] = coef * ((1.0 - x) * Scroller.START_TENSION + x) + x * x * x;
        let y_max = 1.0;
        let y = 0.0, dy = 0.0;
        while (true) {
            y = y_min + (y_max - y_min) / 2.0;
            coef = 3.0 * y * (1.0 - y);
            dy = coef * ((1.0 - y) * Scroller.START_TENSION + y) + y * y * y;
            if (Math.abs(dy - alpha) < 1E-5) break;
            if (dy > alpha) y_max = y;
            else y_min = y;
        }
        Scroller.SPLINE_TIME[i] = coef * ((1.0 - y) * Scroller.P1 + y * Scroller.P2) + y * y * y;
    }
    Scroller.SPLINE_POSITION[Scroller.NB_SAMPLES] = Scroller.SPLINE_TIME[Scroller.NB_SAMPLES] = 1.0;
}