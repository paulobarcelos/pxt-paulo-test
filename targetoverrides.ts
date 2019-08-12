namespace servos {
    export class SBPinServo extends Servo {
        private _pin: AnalogPin;

        constructor(pin: AnalogPin) {
            super();
            this._pin = pin;
        }

        protected internalSetAngle(angle: number): number {
            pins.servoWritePin(this._pin, angle);
            return angle;
        }

        protected internalSetPulse(micros: number): void {
            pins.servoSetPulse(this._pin, micros);
        }

        protected internalStop() {
            pins.analogReadPin(this._pin);
            //pins.setPull(this._pin, PinPullMode.PullNone);
        }
    }
    //% block="servo left" fixedInstance whenUsed
    export const left = new servos.SBPinServo(AnalogPin.P13);
    //% block="servo right" fixedInstance whenUsed
    export const right = new servos.SBPinServo(AnalogPin.P14);
}