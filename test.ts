// tests go here; this will not be compiled when this package is used as a library
basic.forever(function() {
    motorbitCust.motorRun(motorbitCust.Motors.MAll, motorbitCust.Dir.CW, 120)
    basic.pause(500)
    motorbitCust.motorStop(motorbitCust.Motors.MAll)
    basic.pause(500)
    motorbitCust.motorRun(motorbitCust.Motors.MAll, motorbitCust.Dir.CCW, 120)
    basic.pause(500)
    motorbitCust.motorStop(motorbitCust.Motors.MAll)
    basic.pause(500)
})