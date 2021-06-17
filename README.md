# GooBit
 GooBit extension for makecode -- From YFROBOT
Support Motorbit, digital tube display module, ultrasonic module, collision switch, cruise sensor, and rocker module. 支持 MotorBit、数码管显示模块、超声波模块、碰撞开关、巡线传感器、摇杆模块。

[MotorBit is an easy-to-use motor drive expansion board for MicroBit](http://www.yfrobot.com.cn/wiki/index.php?title=Motor:Bit)

[MotorBit To Buy](https://item.taobao.com/item.htm?id=620974170340)

The YFROBOT Motor:Bit is an integrated motor driver and breakout board for the BBC micro:bit. With two integrated motor driver chip DRV8838, your micro:bit can drive two DC motors with 250mA max single channel current.

The Motor:Bit also features the “GVS” connectors, allowing for easy direct connection to compatible “GVS” sensors and outputs. Among these connectors, P0, P1 support sensors with 3.3V power voltage only; P2, P8, support 3.3V or 5V sensors, You can change the output voltage by jumper caps on the board.

## Basic usage

* Set the direction and speed of GooBit motor

```blocks
 GooBit.motorRun(GooBit.Motors.ML, GooBit.Dir.CW, 120)
 GooBit.motorRun(GooBit.Motors.MR, GooBit.Dir.CCW, 120)
```

* Stop the GooBit motor 

```blocks
GooBit.motorStop(GooBit.Motors.ML)
```

* Move forward

```blocks
GooBit.forward(128)
```

* Move back

```blocks
GooBit.back(128)
```

* Turn left

```blocks
GooBit.turnLeft(128)
```

* Turn right

```blocks
GooBit.turnRight(128)
```

* Read IR sensor value

```blocks
basic.showNumber(GooBit.irButtonCode())
```


## License

MIT

Copyright (c) 2021, YFROBOT  


## Supported targets

* for PXT/microbit
  (The metadata above is needed for package search.)