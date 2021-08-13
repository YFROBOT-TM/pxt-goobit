/** 
 * @file main.ts
 * @brief YFROBOT's GooBit makecode library.
 * @n This is a MakeCode graphics programming extension 
 *    for MicroBit motor drive expansion board.
 * 
 * @copyright    YFROBOT,2021
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2021-06-11
*/

// motor pin 
let GooBitMotor1D = DigitalPin.P13
let GooBitMotor1A = AnalogPin.P14
let GooBitMotor2D = DigitalPin.P15
let GooBitMotor2A = AnalogPin.P16
// ultrasonic pin
let GooBitUltrasonicTrig = DigitalPin.P8
let GooBitUltrasonicEcho = DigitalPin.P9
let distanceBuf = 0
// patrol pin
let GooBitPatrolENPin = DigitalPin.P12
let GooBitPatrolLeft = DigitalPin.P0
let GooBitPatrolMiddle = DigitalPin.P1
let GooBitPatrolRight = DigitalPin.P2
// rgbLED pin DigitalPin.P11

//% color="#f8d86a" weight=10 icon="\uf192"
namespace GooBit {

    /////////////////////// IR ///////////////////////
    let irState: IrState

    const MICROBIT_MAKERBIT_IR_NEC = 777
    const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789
    const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790
    const IR_REPEAT = 256
    const IR_INCOMPLETE = 257

    interface IrState {
        protocol: IrProtocol;
        command: number;
        hasNewCommand: boolean;
        bitsReceived: uint8;
        commandBits: uint8;
    }

    export enum IrProtocol {
        //% block="Keyestudio"
        Keyestudio = 0,
        //% block="NEC"
        NEC = 1,
    }

    export enum IrButtonAction {
        //% block="pressed"
        Pressed = 0,
        //% block="released"
        Released = 1,
    }

    export enum IrButton {
        // any button
        //% block="Any"
        Any = -1,

        //IR HANDLE
        //% block="↑"
        UP = 0x11,
        //% block="↓"
        DOWN = 0x91,
        //% block="←"
        LEFT = 0x81,
        //% block="→"
        RIGHT = 0xa1,
        //% block="M1"
        M1 = 0xe9,
        //% block="M2"
        M2 = 0x69,
        //% block="A"
        A = 0x21,
        //% block="B"
        B = 0x01,

        // MINI IR 
        //% block="A"
        Mini_A = 0xa2,
        //% block="B"
        Mini_B = 0x62,
        //% block="C"
        Mini_C = 0xe2,
        //% block="D"
        Mini_D = 0x22,
        //% block="︿"
        Mini_UP = 0x02,
        //% block="E"
        Mini_E = 0xc2,
        //% block="＜"
        Mini_Left = 0xe0,
        //% block="۞"
        Mini_SET = 0xa8,
        //% block="＞"
        Mini_Right = 0x90,
        //% block="0"
        Number_0 = 0x68,
        //% block="﹀"
        Mini_Down = 0x98,
        //% block="F"
        Mini_F = 0xb0,
        //% block="1"
        Number_1 = 0x30,
        //% block="2"
        Number_2 = 0x18,
        //% block="3"
        Number_3 = 0x7a,
        //% block="4"
        Number_4 = 0x10,
        //% block="5"
        Number_5 = 0x38,
        //% block="6"
        Number_6 = 0x5a,
        //% block="7"
        Number_7 = 0x42,
        //% block="8"
        Number_8 = 0x4a,
        //% block="9"
        Number_9 = 0x52,
    }
    /////////////////////// IR ///////////////////////

    export enum Motors {
        //% blockId="M1Motor" block="M1"
        M1 = 0,
        //% blockId="M2Motor" block="M2"
        M2 = 1,
        //% blockId="AllMotors" block="All"
        MAll = 2
    }

    export enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Reverse"
        CCW = 0x1
    }

    export enum PatrolEnable {
        //% blockId="PatrolOn" block="ON"
        PatrolOn = 0x01,
        //% blockId="PatrolOff" block="OFF"
        PatrolOff = 0x00
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 1,
        //% blockId="patrolMiddle" block="middle"
        PatrolMiddle = 2,
        //% blockId="patrolRight" block="right"
        PatrolRight = 3
    }

    /////////////////////// DigitalTubes ///////////////////////
    let PINDIO = DigitalPin.P1;
    let PINCLK = DigitalPin.P2;

    let CMD_SYSTEM_CONFIG = 0x48   
    let DIG1_ADDRESS = 0x68
    let DIG2_ADDRESS = 0x6A
    let DIG3_ADDRESS = 0x6C
    let DIG4_ADDRESS = 0x6E
    let DatAddressArray = [DIG1_ADDRESS, DIG2_ADDRESS, DIG3_ADDRESS, DIG4_ADDRESS];

    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
    let _intensity = 8
    let dbuf = [0, 0, 0, 0]
    /////////////////////// DigitalTubes ///////////////////////
    
    function clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(max, value), min);
    }

    /**
     * Set the direction and speed of GooBit motor.
     * @param index motor m1/m2/all. eg: GooBit.Motors.MAll
     * @param direction direction to turn. eg: GooBit.Dir.CW
     * @param speed speed of motors (0 to 255). eg: 120
     */
    //% weight=90
    //% blockId=GooBit_MotorRun block="motor|%index|move|%direction|at speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        if (index > 2 || index < 0)
            return
        
        let dir_m2 = direction == Dir.CW ? Dir.CCW : Dir.CW;
        speed = clamp(speed, 0, 255) * 4.01;  // 0~255 > 0~1023

        if (index == Motors.M1) {
            pins.digitalWritePin(GooBitMotor1D, direction);
            pins.analogWritePin(GooBitMotor1A, speed);
        } else if (index == Motors.M2) {
            pins.digitalWritePin(GooBitMotor2D, dir_m2);
            pins.analogWritePin(GooBitMotor2A, speed);
        } else if (index == Motors.MAll) {
            pins.digitalWritePin(GooBitMotor1D, direction);
            pins.analogWritePin(GooBitMotor1A, speed);
            pins.digitalWritePin(GooBitMotor2D, dir_m2);
            pins.analogWritePin(GooBitMotor2A, speed);
        }
    }

    /**
     * Stop the GooBit motor.
     * @param motor motor m1/m2/all. eg: GooBit.Motors.MAll
     */
    //% weight=89
    //% blockId=GooBit_motorStop block="motor |%motor stop"
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=2 
    export function motorStop(motor: Motors): void {
        motorRun(motor, 0, 0);
    }
    
    /**
     * Move forward with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=86
    //% blockId=GooBit_forward block="move forward with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function forward(speed: number): void {
        motorRun(Motors.MAll, 0, speed);
    }

    /**
     * Move back with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=85
    //% blockId=GooBit_back block="move back with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function back(speed: number): void {
        motorRun(Motors.MAll, 1, speed);
    }

    /**
     * Turn left with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=84
    //% blockId=GooBit_turnLeft block="turn left with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function turnLeft(speed: number): void {
        motorRun(Motors.M1, 0, speed);
        motorRun(Motors.M2, 0, 0);
    }

    /**
     * Turn right with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=83
    //% blockId=GooBit_turnRight block="turn right with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function turnRight(speed: number): void {
        motorRun(Motors.M1, 0, 0);
        motorRun(Motors.M2, 0, speed);
    }

    /**
      * Enable or Disable line tracking sensor.
      * @param enable line tracking sensor enable signal(0 or 1), eg: valon.PatrolEnable.PatrolOn
      */
    //% weight=79
    //% blockId=GooBit_Patrol_enable block="%enable line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function enablePatrol(enable: PatrolEnable): void {
        pins.digitalWritePin(GooBitPatrolENPin, enable);
        pins.setPull(GooBitPatrolLeft, PinPullMode.PullNone)
        pins.setPull(GooBitPatrolMiddle, PinPullMode.PullNone)
        pins.setPull(GooBitPatrolRight, PinPullMode.PullNone)
    }

    /**
      * Read line tracking sensor.
      * @param patrol patrol sensor number.
      */
    //% weight=78
    //% blockId=GooBit_read_Patrol block="read %patrol line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(GooBitPatrolLeft)
        } else if (patrol == Patrol.PatrolMiddle) {
            return pins.digitalReadPin(GooBitPatrolMiddle)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(GooBitPatrolRight)
        } else {
            return -1
        }
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig trigger pin. eg: DigitalPin.P8
     * @param echo echo pin. eg: DigitalPin.P9
     * @param maxCmDistance maximum distance in centimeters (default is 450)
     */
    //% weight=60
    //% blockId=GooBit_sonar_ping block="ping trig |%trig echo |%echo unit:cm"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=4 
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=4 
    //% inlineInputMode=inline
    export function ping(trig: DigitalPin, echo: DigitalPin, maxCmDistance = 450): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(50);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;

        return Math.floor(ret * 9 / 6 / 58);
        // switch (unit) {
        //     case PingUnit.Centimeters: return Math.idiv(d, 58);
        //     case PingUnit.Inches: return Math.idiv(d, 148);
        //     default: return d ;
        // }
    }
    
    /////////////////////// IR ///////////////////////
    function pushBit(bit: number): number {
        irState.bitsReceived += 1;
        if (irState.bitsReceived <= 8) {
            // ignore all address bits
            if (irState.protocol === IrProtocol.Keyestudio && bit === 1) {
                // recover from missing message bits at the beginning
                // Keyestudio address is 0 and thus missing bits can be easily detected
                // by checking for the first inverse address bit (which is a 1)
                irState.bitsReceived = 9;
            }
            return IR_INCOMPLETE;
        }
        if (irState.bitsReceived <= 16) {
            // ignore all inverse address bits
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived < 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived === 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return irState.commandBits & 0xff;
        } else {
            // ignore all inverse command bits
            return IR_INCOMPLETE;
        }
    }

    function detectCommand(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            // low bit
            return pushBit(0);
        } else if (markAndSpace < 2700) {
            // high bit
            return pushBit(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            // Repeat detected
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            // Start detected
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            const command = detectCommand(mark + space);
            if (command !== IR_INCOMPLETE) {
                control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, command);
            }
        });
    }

    /**
     * Connects to the IR_Receiver module at the specified pin and configures the IR protocol.
     * @param pin IR_Receiver pin. eg: DigitalPin.P2
     * @param protocol IR protocol. eg: GooBit.IrProtocol.NEC
     */
    //% subcategory="IR_Receiver"
    //% blockId="GooBit_infrared_connect_receiver"
    //% block="connect IR_Receiver at pin %pin and decode %protocol"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false"
    //% weight=15
    export function connectIrReceiver(pin: DigitalPin, protocol=IrProtocol.NEC): void {
        if (irState) {
            return;
        }

        irState = {
            protocol: protocol,
            bitsReceived: 0,
            commandBits: 0,
            command: IrButton.Any,
            hasNewCommand: false,
        };

        enableIrMarkSpaceDetection(pin);

        let activeCommand = IR_INCOMPLETE;
        let repeatTimeout = 0;
        const REPEAT_TIMEOUT_MS = 120;

        control.onEvent(
            MICROBIT_MAKERBIT_IR_NEC,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                const necValue = control.eventValue();

                // Refresh repeat timer
                if (necValue <= 255 || necValue === IR_REPEAT) {
                    repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
                }

                // Process a new command
                if (necValue <= 255 && necValue !== activeCommand) {
                    if (activeCommand >= 0) {
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                    }

                    irState.hasNewCommand = true;
                    irState.command = necValue;
                    activeCommand = necValue;
                    control.raiseEvent(MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID, necValue);
                }
            }
        );

        control.inBackground(() => {
            while (true) {
                if (activeCommand === IR_INCOMPLETE) {
                    // sleep to save CPU cylces
                    basic.pause(2 * REPEAT_TIMEOUT_MS);
                } else {
                    const now = input.runningTime();
                    if (now > repeatTimeout) {
                        // repeat timed out
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                        activeCommand = IR_INCOMPLETE;
                    } else {
                        basic.pause(REPEAT_TIMEOUT_MS);
                    }
                }
            }
        });
    }

    /**
     * Do something when a specific button is pressed or released on the remote control.
     * @param button the button to be checked
     * @param action the trigger action
     * @param handler body code to run when event is raised
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_on_ir_button
    //% block="on IR button | %button | %action"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% weight=13
    export function onIrButton(button: IrButton, action: IrButtonAction, handler: () => void) {
        control.onEvent(
            action === IrButtonAction.Pressed
                ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
                : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
            button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
            () => {
                irState.command = control.eventValue();
                handler();
            }
        );
    }

    /**
     * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_ir_button_pressed
    //% block="IR button"
    //% weight=10
    export function irButton(): number {
        if (!irState) {
            return IrButton.Any;
        }
        return irState.command;
    }

    /**
     * Returns true if any button was pressed since the last call of this function. False otherwise.
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_was_any_button_pressed
    //% block="any IR button was pressed"
    //% weight=7
    export function wasAnyIrButtonPressed(): boolean {
        if (!irState) {
            return false;
        }
        if (irState.hasNewCommand) {
            irState.hasNewCommand = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the command code of a specific IR button.
     * @param button the button
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_button_code
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button code %button"
    //% weight=5
    export function irButtonCode(button: IrButton): number {
        return button as number;
    }
    /////////////////////// IR ///////////////////////
}
