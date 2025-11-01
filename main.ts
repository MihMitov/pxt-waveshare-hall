% color=#0066ff icon="\uf076" block="Waveshare Hall"
namespace waveshareHall {

    let hallPin: AnalogPin = AnalogPin.P1
    let threshold = 0.12
    let state = false

    /**
     * Set analog pin for the Hall sensor
     */
    % block="set Hall sensor pin %pin"
    export function setAnalogPin(pin: AnalogPin): void {
        hallPin = pin
    }

    /**
     * Set magnetic detection threshold (0-1)
     */
    % block="set Hall sensitivity %value"
    % value.min=0 value.max=1 value.defl=0.12
    export function setThreshold(value: number) {
        threshold = value
    }

    /**
     * Read magnetic field strength (-1 to +1)
     */
    % block="Hall field strength"
    export function readField(): number {
        const raw = pins.analogReadPin(hallPin)
        return (raw - 512) / 512
    }

    /**
     * True if magnet detected
     */
    % block="magnet present?"
    export function magnetPresent(): boolean {
        return Math.abs(readField()) > threshold
    }

    /**
     * Event: when magnet is detected
     */
    % block="on magnet detected"
    export function onMagnetDetected(handler: () => void) {
        control.inBackground(function () {
            while (true) {
                if (!state && magnetPresent()) {
                    state = true
                    handler()
                }
                pause(20)
            }
        })
    }

    /**
     * Event: when magnet is removed
     */
    % block="on magnet removed"
    export function onMagnetRemoved(handler: () => void) {
        control.inBackground(function () {
            while (true) {
                if (state && !magnetPresent()) {
                    state = false
                    handler()
                }
                pause(20)
            }
        })
    }
}
