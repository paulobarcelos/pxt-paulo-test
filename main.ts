/**
 * Pre-Defined positions
 */
enum SBPositions {
    //% block="left"
    Left = 0,
    //% block="right"
    Right = 1
}

/**
 * Pre-Defined colors
 */
enum SBColors {
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
//% groups='["Positional", "Continuous", "Configuration"]'
namespace strawbees {
    ////////////////////////////////////////////////////////////////////////////
    // LEDs
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
     * Set LED to a given color (range 0-255 for r, g, b).
     *
     * @param ledId position of the LED (0 or 1)
     * @param rgb RGB color of the LED
     */
    //% blockId="strawbees_neo_set_pixel_color" block="set LED %ledId=sb_positions|to %rgb=sb_colors"
    //% weight=100
    //% subcategory=LEDs
    export function neoSetPixelColor(ledId: number, rgb: number): void {
        neo().setPixelColor(ledId, rgb);
        neo().show();
    }

    /**
     * Sets all LEDs to a given color (range 0-255 for r, g, b).
     * @param rgb RGB color of the LED
    */
    //% blockId="strawbees_neo_set_color" block="set all LEDs to %rgb=sb_colors"
    //% weight=99
    //% subcategory=LEDs
    export function neoSetColor(rgb: number) {
        neo().showColor(rgb);
        neo().show();
    }

    /**
     * Clear all leds.
     */
    //% blockId="strawbees_neo_clear" block="clear all LEDs"
    //% weight=98
    //% subcategory=LEDs
    export function neoClear(): void {
        neo().clear();
        neo().show();
    }

    /**
     * Set the brightness of the LEDs
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="strawbees_neo_brightness" block="set all LEDs brightness to %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=97
    //% subcategory=LEDs
    export function neoBrightness(brightness: number): void {
        neo().setBrightness(brightness);
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
    let _servoLeft: Servo;
    let _servoRight: Servo;
    /**
     * Access (and create if needed) a servo instace.
     * @param servoId the id of the servo. eg. SBPositions.Left
     */
    function servo(servoId: number): Servo {
        switch (servoId) {
            case 0:
                if (!_servoLeft) {
                    _servoLeft = new Servo(AnalogPin.P13);
                    pins.servoWritePin(AnalogPin.P13, 90);
                }
                return _servoLeft;
            case 1:
                if (!_servoRight) {
                    _servoRight = new Servo(AnalogPin.P14);
                    pins.servoWritePin(AnalogPin.P14, 90);
                }
                return _servoRight;
        }
        return null;
    }
    /**
     * Set the servo angle
     */
    //% weight=80 help=servos/set-angle
    //% subcategory=Servos
    //% blockId=strawbees_servoservosetangle block="set servo %servoId=sb_positions|angle to %degrees=protractorPicker °"
    //% degrees.defl=90
    //% blockGap=8
    //% parts=microservo trackArgs=0
    //% group="Positional"
    export function servoSetAngle(servoId: number, degrees: number): void {
        servo(servoId).setAngle(degrees);
    }

    /**
     * Set the throttle on a continuous servo
     * @param speed the throttle of the motor from -100% to 100%
     */
    //% blockId=strawbees_servoservorun block="continuous servo %servoId=sb_positions|run at %speed=speedPicker \\%"
    //% subcategory=Servos
    //% weight=79 help=servos/run
    //% parts=microservo trackArgs=0
    //% group="Continuous"
    //% blockGap=8
    export function servoRun(servoId: number, speed: number): void {
        servo(servoId).run(speed);
    }

    /**
     * Stop sending commands to the servo so that its rotation will stop at the current position.
     */
    // On a normal servo this will stop the servo where it is, rather than return it to neutral position.
    // It will also not provide any holding force.
    //% blockId=strawbees_servoservostop block="stop servo %servoId=sb_positions"
    //% weight=78 help=servos/stop
    //% subcategory=Servos
    //% parts=microservo trackArgs=0
    //% group="Continuous"
    //% blockGap=8
    export function servoStop(servoId: number) {
        servo(servoId).stop();
    }

    /**
     * Set the possible rotation range angles for the servo between 0 and 180
     * @param minAngle the minimum angle from 0 to 90
     * @param maxAngle the maximum angle from 90 to 180
     */
    //% blockId=strawbees_servosetrange block="set servo %servoId=sb_positions|range from %minAngle to %maxAngle"
    //% weight=77 help=servos/set-range
    //% subcategory=Servos
    //% minAngle.min=0 minAngle.max=90
    //% maxAngle.min=90 maxAngle.max=180 maxAngle.defl=180
    //% parts=microservo trackArgs=0
    //% group="Configuration"
    //% blockGap=8
    export function servoSetRange(servoId: number, minAngle: number, maxAngle: number): void {
        servo(servoId).setRange(minAngle, maxAngle);
    }

    /**
     * Set a servo stop mode so it will stop when the rotation angle is in the neutral position, 90 degrees.
     * @param on true to enable this mode
     */
    //% blockId=strawbees_servostoponneutral block="set servo %servoId=sb_positions|stop on neutral %enabled"
    //% weight=76 help=servos/set-stop-on-neutral
    //% subcategory=Servos
    //% enabled.shadow=toggleOnOff
    //% group="Configuration"
    //% blockGap=8
    export function servoSetStopOnNeutral(servoId: number, enabled: boolean): void {
        servo(servoId).setStopOnNeutral(enabled);
    }

    ////////////////////////////////////////////////////////////////////////////
    // More
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Get numeric value of a color
     *
     * @param color Standard RGB Led Colors
     */
    //% blockId="sb_colors" block=%color
    //% weight=55
    //% advanced=true
    export function SBColors(color: SBColors): number {
        return color;
    }

    /**
     * Get numeric value of a position
     *
     * @param position Standard position
     */
    //% blockId="sb_positions" block=%position
    //% weight=45
    //% advanced=true
    export function SBPositions(position: SBPositions): number {
        return position;
    }

    /**
     * Convert from RGB values to color number
     *
     * @param red Red value of the LED (0 to 255)
     * @param green Green value of the LED (0 to 255)
     * @param blue Blue value of the LED (0 to 255)
     */
    //% blockId="strawbees_convertRGB" block="convert from red %red| green %green| blue %blue"
    //% weight=40
    //% advanced=true
    export function convertRGB(r: number, g: number, b: number): number {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

}
