# GooBit
 GooBit extension for makecode -- From YFROBOT
Support Motorbit, integrated ultrasonic ranging, patrol line, infrared remote control, RGB led and other functions. 支持MotorBit，集成超声波测距、巡线行驶、红外遥控、彩灯等功能。

[GooBit is an easy-to-use education robot kit for MicroBit](http://yfrobot.com.cn/wiki/index.php?title=GooBit%E5%B0%8F%E8%BD%A6%E5%A5%97%E4%BB%B6)

[MotorBit To Buy](https://item.taobao.com/item.htm?id=655454133315)

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