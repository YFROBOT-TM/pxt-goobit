// tests go here; this will not be compiled when this package is used as a library
basic.forever(function() {
    GooBit.motorRun(GooBit.Motors.MAll, GooBit.Dir.CW, 120)
    basic.pause(500)
    GooBit.motorStop(GooBit.Motors.MAll)
    basic.pause(500)
    GooBit.motorRun(GooBit.Motors.MAll, GooBit.Dir.CCW, 120)
    basic.pause(500)
    GooBit.motorStop(GooBit.Motors.MAll)
    basic.pause(500)
})