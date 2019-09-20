/**
 * Neopixel ids
 */
enum SBNeopixelLabels {
    //% block="A"
    NeopixelA = 0,
    //% block="B"
    NeopixelB = 1
}

/**
 * Servo ids
 */
enum SBServoLabels {
    //% block="1"
    Servo1 = 0,
    //% block="2"
    Servo2 = 1
}

/**
 * Pre-Defined colors
 */
enum SBColorLabels {
    //% block=red
    Red = 0xff0000,
    //% block=orange
    Orange = 0xffa500,
    //% block=yellow
    Yellow = 0xffff00,
    //% block=green
    Green = 0x00ff00,
    //% block=blue
    Blue = 0x0000ff,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xff00ff,
    //% block=white
    White = 0xffffff,
    //% block=black
    Black = 0x000000
}

/**
 * Custom blocks
 */
//% weight=100 color="#f443b0" icon="\u24C8" blockGap=8
namespace strawbees {
    ////////////////////////////////////////////////////////////////////////////
    // Neopixels
    ////////////////////////////////////////////////////////////////////////////
    let _neo: neopixel.Strip;
    /**
     * Access (and create if needed) a neopixel strip.
     * Default to brightness 40.
     */
    function neo(): neopixel.Strip {
        if (!_neo) {
            _neo = neopixel.create(DigitalPin.P8, 2, NeoPixelMode.RGB);
            _neo.setBrightness(40);
        }
        return _neo;
    }

    /**
     * Sets the color of an individual neopixel by specifying the amount of
     * `red`, `green` and `blue` in the color. The amounts range from `0` to
     * `100`.
     * @param neopixelLabel Which neopixel to set the color.
     * @param red Amount of red in color ranging from `0` to `100`.
     * @param green Amount of green in color ranging from `0` to `100`.
     * @param blue Amount of blue in color ranging from `0` to `100`.
     */
    //% blockId="sb_setNeopixelColorRGB"
    //% block="set neopixel %neopixelLabel to red %red green %green blue %blue"
    //% neopixelLabel.shadow=sb_neopixel_labels
    //% red.min=0 red.max=100 red.defl=100
    //% green.min=0 green.max=100 green.defl=0
    //% blue.min=0 blue.max=100 blue.defl=0
    //% inlineInputMode=inline
    export function setNeopixelColorRGB(neopixelLabel: number, red: number, green: number, blue: number): void {
        neo().setPixelColor(neopixelLabel, getHexColorFromRGB(red, green, blue));
        neo().show();
    }

    /**
     * Sets the color of an individual neopixel by specifying the amount of
     * `hue`, `saturation` and `brightness` in the color. The amounts range from
     * `0` to `100`.
     * @param neopixelLabel Which neopixel to set the color.
     * @param hue Hue of the color ranging from `0` to `100`.
     * @param saturation Saturation of the color ranging from `0` to `100`.
     * @param brightness Brightness of the color ranging from `0` to `100`.
     */
    //% blockId="sb_setNeopixelColorHSB"
    //% block="set neopixel %neopixelLabel to hue %hue saturation %saturation brightness %brightness"
    //% neopixelLabel.shadow=sb_neopixel_labels
    //% hue.min=0 hue.max=100 hue.defl=0
    //% saturation.min=0 saturation.max=100 saturation.defl=100
    //% brightness.min=0 brightness.max=100 brightness.defl=100
    //% inlineInputMode=inline
    export function setNeopixelColorHSB(neopixelLabel: number, hue: number, saturation: number, brightness: number): void {
        neo().setPixelColor(neopixelLabel, getHexColorFromHSB(hue, saturation, brightness));
        neo().show();
    }

    /**
     * Sets the color of an individual neopixel by specifying the color by name.
     * @param neopixelLabel Which neopixel to set the color.
     * @param colorLabel The name of the color from a list of color labels.
     */
    //% blockId="sb_setNeopixelColorLabel"
    //% block="set neopixel %neopixelLabel to %colorLabel"
    //% neopixelLabel.shadow=sb_neopixel_labels
    //% colorLabel.shadow=sb_color_labels
    //% inlineInputMode=inline
    export function setNeopixelColorLabel(neopixelLabel: number, colorLabel: number): void {
        neo().setPixelColor(neopixelLabel, colorLabel);
        neo().show();
    }

    /**
     * Sets the brightness of all the neopixels by specifying a value ranging
     * from `0%` to `100%`.
     * @param brightness Brightness of the neopixels from `0%` to `100%`.
     */
    //% blockId="sb_setNeopixelsBrightness"
    //% block="set neopixels brightness to %brightness\\%"
    //% brightness.min=0 brightness.max=100
    //% advanced=true
    export function setNeopixelsBrightness(brightness: number): void {
        neo().setBrightness((brightness / 100) * 255);
        neo().show();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Servos
    ////////////////////////////////////////////////////////////////////////////
    class Servo extends servos.Servo {
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
    let _servo1: Servo;
    let _servo2: Servo;
    /**
     * Access (and create if needed) a servo instace.
     * @param id the id of the servo. eg. SBServoLabels.Left
     */
    function servo(servoLabel: number): Servo {
        switch (servoLabel) {
            case 0:
                if (!_servo1) {
                    _servo1 = new Servo(AnalogPin.P13);
                    pins.servoWritePin(AnalogPin.P13, 90);
                }
                return _servo1;
            case 1:
                if (!_servo2) {
                    _servo2 = new Servo(AnalogPin.P14);
                    pins.servoWritePin(AnalogPin.P14, 90);
                }
                return _servo2;
        }
        return null;
    }
    /**
     * Sets the position of a servo by specifying the angle in degrees.
     * @param servoLabel The servo to set the position to.
     * @param degrees The angle to be set from `0` to `180` degrees.
     */
    //% blockId=sb_setServoAngle block="set servo %servoLabel angle to %degrees°"
    //% servoLabel.shadow=sb_servo_labels
    //% degrees.shadow=protractorPicker
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    export function setServoAngle(servoLabel: number, degrees: number): void {
        servo(servoLabel).setAngle(degrees);
    }

    /**
     * Sets the speed of a continuous servo in a arbitrary range from `-100%` to
     * `100%`.
     * @param servoLabel The continuous servo to set the speed to.
     * @param speed The speed from `-100%` to `100%`.
     */
    //% blockId=sb_setContinuousServoSpeed block="set continuous servo %servoLabel speed to %speed\\%"
    //% servoLabel.shadow=sb_servo_labels
    //% speed.shadow=speedPicker
    export function setContinuousServoSpeed(servoLabel: number, speed: number): void {
        servo(servoLabel).run(speed);
    }

    /**
     * Turns a servo off so that no force will be applied and the horn can be 
     * rotated manually. This saves battery.
     * @param servoLabel The servo to turn off.
     */
    //% blockId=sb_turnOffServo
    //% block="turn off servo %servoLabel"
    //% servoLabel.shadow=sb_servo_labels
    export function turnOffServo(servoLabel: number) {
        servo(servoLabel).stop();
    }
    ////////////////////////////////////////////////////////////////////////////
    // More
    ////////////////////////////////////////////////////////////////////////////
    /**
     * A label of a neopixel
     *
     * @param label Neopixel ID
     */
    //% blockId="sb_neopixel_labels" block=%label
    //% advanced=true
    export function SBNeopixelLabels(label: SBNeopixelLabels): SBNeopixelLabels {
        return label;
    }

    /**
     * A label of a servo
     *
     * @param label Servo ID
     */
    //% blockId="sb_servo_labels" block=%label
    //% advanced=true
    export function SBServoLabels(label: SBServoLabels): SBServoLabels {
        return label;
    }

    /**
     * A label of a color
     *
     * @param color Standard RGB Led Colors
     */
    //% blockId="sb_color_labels" block=%color
    //% advanced=true
    export function SBColorLabels(color: SBColorLabels): SBColorLabels {
        return color;
    }

    /**
     * Calculates the hexadecimal representation of a color from the amounts of
     * `red`, `green` and `blue` in that the color.
     * @param red Amount of red in color ranging from `0` to `100`
     * @param green Amount of green in color ranging from `0` to `100`
     * @param blue Amount of blue in color ranging from `0` to `100`
     */
    //% blockId="sb_getHexColorFromRGB"
    //% block="red %red green %green blue %blue"
    //% red.min=0 red.max=100 red.defl=0
    //% green.min=0 green.max=100 green.defl=0
    //% blue.min=0 blue.max=100 blue.defl=0
    //% inlineInputMode=inline
    //% advanced=true
    export function getHexColorFromRGB(red: number, green: number, blue: number): number {
        return ((((red / 100) * 255) & 0xFF) << 16) | ((((green / 100) * 255) & 0xFF) << 8) | (((blue / 100) * 255) & 0xFF);
    }

    /**
     * Calculates the hexadecimal representation of a color from the `hue`, 
     * `saturation` and `brightness` of that the color.
     * @param hue Hue of the color ranging from `0` to `100`
     * @param saturation Saturation of the color ranging from `0` to `100`
     * @param brightness Brightness of the color ranging from `0` to `100`
     */
    //% blockId="sb_getHexColorFromHSB"
    //% block="hue %hue saturation %saturation brightness %brightness"
    //% hue.min=0 hue.max=100
    //% saturation.min=0 saturation.max=100
    //% brightness.min=0 brightness.max=100
    //% inlineInputMode=inline
    //% advanced=true
    export function getHexColorFromHSB(hue: number, saturation: number, brightness: number): number {
        let h, s, v, r, g, b, i, f, p, q, t;
        h = hue / 100;
        s = saturation / 100;
        v = brightness / 100;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return getHexColorFromRGB(r * 100, g * 100, b * 100);
    }

}
