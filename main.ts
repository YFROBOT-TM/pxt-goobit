/** 
 * @file motorbitCust.ts
 * @brief Customize YFROBOT's motorbitCust makecode library.
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
let motorbitCustMotor1D = DigitalPin.P13
let motorbitCustMotor1A = AnalogPin.P14
let motorbitCustMotor2D = DigitalPin.P15
let motorbitCustMotor2A = AnalogPin.P16

//% color="#5698c3" weight=10 icon="\uf12e"
namespace motorbitCust {

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

    export enum PingUnit {
        //% block="μs"
        MicroSeconds,
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
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
     * Set the direction and speed of motorbitCust motor.
     * @param index motor m1/m2/all. eg: motorbitCust.Motors.MAll
     * @param direction direction to turn. eg: motorbitCust.Dir.CW
     * @param speed speed of motors (0 to 255). eg: 120
     */
    //% weight=90
    //% blockId=motorbitCust_MotorRun block="motor|%index|move|%direction|at speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        if (index > 2 || index < 0)
            return
        
        let dir_m2 = direction == Dir.CW ? Dir.CCW : Dir.CW;
        speed = clamp(speed, 0, 255) * 4.01;  // 0~255 > 0~1023

        if (index == Motors.M1) {
            pins.digitalWritePin(motorbitCustMotor1D, direction);
            pins.analogWritePin(motorbitCustMotor1A, speed);
        } else if (index == Motors.M2) {
            pins.digitalWritePin(motorbitCustMotor2D, dir_m2);
            pins.analogWritePin(motorbitCustMotor2A, speed);
        } else if (index == Motors.MAll) {
            pins.digitalWritePin(motorbitCustMotor1D, direction);
            pins.analogWritePin(motorbitCustMotor1A, speed);
            pins.digitalWritePin(motorbitCustMotor2D, dir_m2);
            pins.analogWritePin(motorbitCustMotor2A, speed);
        }
    }

    /**
     * Stop the motorbitCust motor.
     * @param motor motor m1/m2/all. eg: motorbitCust.Motors.MAll
     */
    //% weight=89
    //% blockId=motorbitCust_motorStop block="motor |%motor stop"
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=2 
    export function motorStop(motor: Motors): void {
        motorRun(motor, 0, 0);
    }
    
    /**
     * Move forward with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=70
    //% blockId=motorbitCust_forward block="move forward with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function forward(speed: number): void {
        motorRun(Motors.MAll, 0, speed);
    }

    /**
     * Move back with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=69
    //% blockId=motorbitCust_back block="move back with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function back(speed: number): void {
        motorRun(Motors.MAll, 1, speed);
    }

    /**
     * Turn left with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=65
    //% blockId=motorbitCust_turnLeft block="turn left with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function turnLeft(speed: number): void {
        motorRun(Motors.M1, 0, 0);
        motorRun(Motors.M2, 0, speed);
    }

    /**
     * Turn right with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     */
    //% weight=64
    //% blockId=motorbitCust_turnRight block="turn right with speed %speed"
    //% speed.min=0 speed.max=255
    //% advanced=true
    export function turnRight(speed: number): void {
        motorRun(Motors.M1, 0, speed);
        motorRun(Motors.M2, 0, 0);
    }

    /**
     * Read the Collision Switch.
     * @param pin collision Switch pin. eg: DigitalPin.P8
     * @returns the Collision Switch Value.
     */
    //% weight=60
    //% blockId=motorbitCust_readCollisionSwitch
    //% block="Read Collision Switch on %pin"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4 
    export function readCollisionSwitch(pin: DigitalPin): number {
        return pins.digitalReadPin(pin)
    }

    /**
     * Read the Left Patrol Sensor.
     * @param pinl the Left Patrol Sensor pin. eg: DigitalPin.P2
     * @returns the Left Patrol Sensor Value.
     */
    //% weight=59
    //% blockId=motorbitCust_readLeftPatrolSensor
    //% block="Read Left Patrol Sensor on %pin"
    //% pinl.fieldEditor="gridpicker" pinl.fieldOptions.columns=4 
    export function readLeftPatrolSensor(pinl: DigitalPin): number {
        return pins.digitalReadPin(pinl)
    }

    /**
     * Read the Right Patrol Sensor.
     * @param pinr the Right Patrol Sensor pin. eg: DigitalPin.P8
     * @returns the Right Patrol Sensor Value.
     */
    //% weight=58
    //% blockId=motorbitCust_readRightPatrolSensor
    //% block="Read Right Patrol Sensor on %pin"
    //% pinr.fieldEditor="gridpicker" pinr.fieldOptions.columns=4 
    export function readRightPatrolSensor(pinr: DigitalPin): number {
        return pins.digitalReadPin(pinr)
    }

    /**
     * Read X-axis of the Rocker.
     * @param pinx the X-axis pin. eg: AnalogPin.P1
     * @returns the X-axis Value.
     */
    //% weight=55
    //% blockId=motorbitCust_readXRocker
    //% block="Read Rocker X-axis on %pin"
    //% pinx.fieldEditor="gridpicker" pinx.fieldOptions.columns=4 
    export function readXRocker(pinx: AnalogPin): number {
        return pins.analogReadPin(pinx)
    }

    /**
     * Read Y-axis of the Rocker.
     * @param piny the Y-axis pin. eg: AnalogPin.P2
     * @returns the Y-axis Value.
     */
    //% weight=54
    //% blockId=motorbitCust_readYRocker
    //% block="Read Rocker Y-axis on %pin"
    //% piny.fieldEditor="gridpicker" piny.fieldOptions.columns=4 
    export function readYRocker(piny: AnalogPin): number {
        return pins.analogReadPin(piny)
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig trigger pin. eg: DigitalPin.P2
     * @param echo echo pin. eg: DigitalPin.P8
     * @param unit desired conversion unit. eg: PingUnit.Centimeters
     * @param maxCmDistance maximum distance in centimeters (default is 450)
     */
    //% weight=50
    //% blockId=motorbitCust_sonar_ping block="ping trig |%trig echo |%echo unit |%unit"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=4 
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=4 
    //% unit.fieldEditor="gridpicker" unit.fieldOptions.columns=3 
    //% inlineInputMode=inline
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 450): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(50);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d ;
        }
    }

    /////////////////////// DigitalTubes ///////////////////////
    /**
     * Connects to the digital tube module at the specified pin.
     * @param pin_d DIO pin. eg: DigitalPin.P1
     * @param pin_c CLK pin. eg: DigitalPin.P2
     */
    //% subcategory="DigitalTube"
    //% weight=59
    //% blockId="motorbitCust_4digitaltubes_pins"
    //% block="connect 4 digital tubes at DIO %pin_d and CLK %pin_c"
    //% pin_c.fieldEditor="gridpicker" pin_c.fieldOptions.columns=4 pin_c.fieldOptions.tooltips="false"
    //% pin_d.fieldEditor="gridpicker" pin_d.fieldOptions.columns=4 pin_d.fieldOptions.tooltips="false"
    export function connectPIN(pin_d: DigitalPin, pin_c: DigitalPin): void {
        PINCLK = pin_c;
        PINDIO = pin_d;
        on();
        clear();
    }

    /** FrameStart_1650 
     */
    function FrameStart_1650(): void {
        pins.digitalWritePin(PINDIO, 1);
        pins.digitalWritePin(PINCLK, 1);
        pins.digitalWritePin(PINDIO, 0);
    }

    /** FrameEnd_1650 
     */
    function FrameEnd_1650(): void {
        pins.digitalWritePin(PINDIO, 0);
        pins.digitalWritePin(PINCLK, 1);
        pins.digitalWritePin(PINDIO, 1);
    }

    /** FrameAck_1650 
     */
    function FrameAck_1650(): number {
        if(pins.digitalReadPin(PINDIO) == 0) {
            pins.digitalWritePin(PINCLK , 1);	
            pins.digitalWritePin(PINCLK , 0);	
            return 0;
        } else {
            return 1;
        }
    }

    /** writeByte 
     */
    function writeByte(firstByte: number, secondByte: number): number {
        let tmp=0;
        let i=0;
        let err=0;		
        tmp=firstByte;

        FrameStart_1650();
        for(i=0;i<8;i++) {
            if(tmp&0x80) {
                pins.digitalWritePin(PINDIO, 1);
            } else {
                pins.digitalWritePin(PINDIO, 0);
            }
            pins.digitalWritePin(PINCLK , 0);
            pins.digitalWritePin(PINCLK , 1);
            pins.digitalWritePin(PINCLK , 0);
            
            tmp=tmp<<1;
        }
        if(FrameAck_1650() == 1) {
            err=1;
        }
        tmp=secondByte;
        for(i=0;i<8;i++) {
            if(tmp&0x80) {
                pins.digitalWritePin(PINDIO, 1);
            } else {
                pins.digitalWritePin(PINDIO, 0);
            }
        
            pins.digitalWritePin(PINCLK , 0);
            pins.digitalWritePin(PINCLK , 1);
            pins.digitalWritePin(PINCLK , 0);
            
            tmp=tmp<<1;
        }
        if(FrameAck_1650()==1) {
            err=1;
        }
        FrameEnd_1650();
        return err;
    }

    /**
     * send command to display
     * @param c command, eg: 0
     */
    function cmd(c: number) {
        writeByte(CMD_SYSTEM_CONFIG, c);
    }

    /**
     * send data to display
     * @param d data, eg: 0
     * @param bit bit, eg: 0
     */
    function dat(bit: number, d: number) {
        writeByte(DatAddressArray[bit % 4], d);
    }

    /**
     * turn on display
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_ON" block="turn on display"
    //% weight=15 blockGap=8
    export function on() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * turn off display
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_OFF" block="turn off display"
    //% weight=10 blockGap=8
    export function off() {
        _intensity = 0
        cmd(0)
    }

    /**
     * clear display content
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_CLEAR" block="clear display"
    //% weight=5 blockGap=8
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param num is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_DIGIT" block="show digit %num|at %bit"
    //% weight=40 blockGap=8
    //% num.max=15 num.min=0
    //% bit.max=3 bit.min=0
    export function digit(num: number, bit: number) {
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_SHOW_NUMBER" block="show number %num"
    //% weight=45 blockGap=8
    export function showNumber(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit(Math.idiv(num, 1000) % 10, 0)
        digit(num % 10, 3)
        digit(Math.idiv(num, 10) % 10, 2)
        digit(Math.idiv(num, 100) % 10, 1)
    }

    /**
     * show a number in hex format
     * @param num is number will be shown, eg: 123
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_SHOW_HEX_NUMBER" block="show hex number %num"
    //% weight=43 blockGap=8
    export function showHex(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit((num >> 12) % 16, 0)
        digit(num % 16, 3)
        digit((num >> 4) % 16, 2)
        digit((num >> 8) % 16, 1)
    }

    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: true
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_SHOW_DP" block="at %bit|show dot point %show"
    //% weight=38 blockGap=8
    //% bit.max=3 bit.min=0
    export function showDpAt(bit: number, show: boolean) {
        if (show) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
     * set display intensity
     * @param dat is intensity of the display, eg: 3
     */
    //% subcategory="DigitalTube"
    //% blockId="motorbitCust_TM650_INTENSITY" block="set intensity %dat"
    //% weight=35 blockGap=8
    //% dat.max=7 dat.min=0
    export function setIntensity(dat: number) {
        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            off()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }
    /////////////////////// DigitalTubes ///////////////////////
    
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
     * Connects to the IR receiver module at the specified pin and configures the IR protocol.
     * @param pin IR receiver pin. eg: DigitalPin.P2
     * @param protocol IR protocol. eg: motorbitCust.IrProtocol.NEC
     */
    //% subcategory="IR Receiver"
    //% blockId="makerbit_infrared_connect_receiver"
    //% block="connect IR receiver at pin %pin and decode %protocol"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false"
    //% weight=15
    export function connectIrReceiver(pin: DigitalPin, protocol: IrProtocol): void {
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
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_on_ir_button
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
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_ir_button_pressed
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
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_was_any_button_pressed
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
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_button_code
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
