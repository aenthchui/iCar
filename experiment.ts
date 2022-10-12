//% color="#EC7482" weight=4 icon="\uf0c3" block="CUHK_JC_iCar_Experiments"
//% groups='["iCar Food Delivery"]'

namespace CUHK_JC_iCar_Experiments {
    let Current_Location = 0
    let Pointing = 1
    let Target = 0
    let start = 0
    let end = 0
    let tag: number[] = []

    export function sort(location: string[]): number[] {
        let tag_numbers: number[] = []
        if ((location.indexOf("A") != -1) || (location.indexOf("a") != -1)) { tag_numbers.push(1) }
        if ((location.indexOf("B") != -1) || (location.indexOf("b") != -1)) { tag_numbers.push(2) }
        if ((location.indexOf("C") != -1) || (location.indexOf("c") != -1)) { tag_numbers.push(3) }
        if ((location.indexOf("D") != -1) || (location.indexOf("d") != -1)) { tag_numbers.push(4) }
        if ((location.indexOf("E") != -1) || (location.indexOf("e") != -1)) { tag_numbers.push(5) }
        if ((location.indexOf("F") != -1) || (location.indexOf("f") != -1)) { tag_numbers.push(6) }
        if ((location.indexOf("G") != -1) || (location.indexOf("g") != -1)) { tag_numbers.push(7) }
        if ((location.indexOf("H") != -1) || (location.indexOf("h") != -1)) { tag_numbers.push(8) }
        return tag_numbers
    }

    export function search_to_Left_Right(target: number): number {
        if (target >= Pointing) {
            if (target - Pointing <= 4) return 1
            else return 2
        } else {
            if (target - Pointing <= -4) return 1
            else return 2
        }
    }
    function Search_Tag(tag: number, LeftRight: number, LSpeed: number, RSpeed: number, FSpeed: number) {
        if (LeftRight == 1) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        } else {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
        }
        huskylens.request()
        while (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            huskylens.request()
        }
        while (true) {
            huskylens.request()
            while (huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
                if (huskylens.readeBox(tag, Content1.xCenter) < 140) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, LSpeed * 0.7)
                } else if (huskylens.readeBox(tag, Content1.xCenter) > 180) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed * 0.7)
                } else {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed * 0.7)
                }
                huskylens.request()
            }
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed * 0.7)
            basic.pause(500)
            huskylens.request()
            if (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                break;
            }
        }
    }
    export function Line_Follow_Until_Tag(tag: number, LSpeed: number, RSpeed: number, FSpeed: number, straight: boolean) {
        huskylens.request()
        while (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            for (let index = 0; index < 5; index++) {
                Line_Following(LSpeed, RSpeed, FSpeed)
            }
            huskylens.request()
        }
        while (true) {
            while (huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
                for (let index = 0; index < 5; index++) {
                    Line_Following(LSpeed, RSpeed, FSpeed)
                }
                huskylens.request()
            }
            CUHK_JC_iCar.carStop()
            basic.pause(50)
            huskylens.request()
            if (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                break;
            }
        }

        Current_Location = tag
        if (straight == true) {
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            forward_until_tag(tag, FSpeed)
            Turn_90_Deg(RSpeed)
        }
    }
    function forward_until_tag(tag: number, FSpeed: number) {
        huskylens.request()
        while (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
            huskylens.request()
        }
    }

    function home_calibration(LSpeed: number, RSpeed: number, FSpeed: number) {
        forward_until_tag(9, FSpeed)
        Search_Tag(9, 1, LSpeed, RSpeed, FSpeed)
    }

    function Turn_90_Deg(RSpeed: number) {
        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        }
        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        }
    }
    function Line_Following(LSpeed: number, RSpeed: number, FSpeed: number) {
        if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
        } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed)
        } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, LSpeed)
        } else {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
        }
    }
    function Update_Pointing(): number {
        if (Current_Location + 4 > 8) { return (Current_Location + 4 - 8) }
        else return (Current_Location + 4)
    }
    function Complicated_Case(tag: number[]): boolean {
        if (tag.indexOf(1) != -1 && tag.indexOf(8) != -1 || tag.indexOf(1) != -1 && tag.indexOf(7) != -1 || tag.indexOf(2) != -1 && tag.indexOf(8) != -1) {
            for (let index = 0; index <= 8; index++) {
                if (tag.indexOf(8 - index) != -1 && tag.indexOf(7 - index) == -1 && tag.indexOf(6 - index) == -1) {
                    start = 8 - index
                    break;
                }
            }
            for (let index2 = 0; index2 <= 7; index2++) {
                if (tag.indexOf(index2 + 1) != -1 && tag.indexOf(index2 + 2) == -1 && tag.indexOf(index2 + 3) == -1) {
                    end = index2 + 1
                    break;
                }
            }
            return true
        }
        return false
    }
    function turn_to_tag(t: number, LSpeed: number, RSpeed: number, FSpeed: number, straight: boolean) {
        CUHK_JC_iCar.headLightsOff()
        Line_Follow_Until_Tag(t, LSpeed, RSpeed, FSpeed, false)
        if (tag.indexOf(t) != -1) {
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(1000)
            tag.removeAt(tag.indexOf(t))
        }
        CUHK_JC_iCar.headLightsOff()
    }
    export function switch1(t: number, LSpeed: number, RSpeed: number, FSpeed: number, straight: boolean): number {
        Line_Follow_Until_Tag(t, LSpeed, RSpeed, FSpeed, false)
        if (tag.length != 0) {
            if (tag[0] - Current_Location < 2) {
                switch1(tag[0], LSpeed, RSpeed, FSpeed, false)
            } else {
                return 0
            }
        } else {
            return 0
        }
        return 0
    }
    /**
    * Sample points of delivering to A, B, F, G
    */
    //% block="Points A,B,F,G"
    //% group="iCar Food Delivery" blockGap=10
    export function ABFG(): string[] {
        return ["a", "b", "f", "g"]
    }
    /**
    * Move iCar to array of points(A to H) using Knowledge-bases reasoning, click "+" to customize speed values
    */
    //% block="iCar deliver food to $location using KNOWLEDGE-based reasoning || at left turn speed %LSpeed\\%, right turn speed %RSpeed\\%, forward speed %FSpeed\\%"
    //% LSpeed.min=1 LSpeed.max=100 LSpeed.defl=20
    //% RSpeed.min=1 RSpeed.max=100 RSpeed.defl=20
    //% FSpeed.min=1 FSpeed.max=100 FSpeed.defl=20
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    //% group="iCar Food Delivery" blockGap=10
    export function knowledge(location: string[], LSpeed?: number, RSpeed?: number, FSpeed?: number): void {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
        tag = sort(location)
        if (Complicated_Case(tag)) {
            Search_Tag(start, search_to_Left_Right(start), LSpeed, RSpeed, FSpeed)
            Line_Follow_Until_Tag(start, LSpeed, RSpeed, FSpeed, true)
            tag.removeAt(tag.indexOf(start))
            let counter = 9
            CUHK_JC_iCar.headLightsOff()
            while (Current_Location != end) {
                counter = Current_Location + 1
                if (Current_Location + 1 > 8) { counter = 1 }
                Line_Follow_Until_Tag(counter, LSpeed, RSpeed, FSpeed, false)
                if (tag.indexOf(counter) != -1) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    tag.removeAt(tag.indexOf(counter))
                }
                CUHK_JC_iCar.headLightsOff()
            }
            while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
            }
            Turn_90_Deg(RSpeed)
            Turn_90_Deg(RSpeed)
            Line_Follow_Until_Tag(end, LSpeed, RSpeed, FSpeed, false)
            home_calibration(LSpeed, RSpeed, FSpeed)
            while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
            }
            CUHK_JC_iCar.carStop()
            Current_Location = end
            Update_Pointing()
        }
        while (tag.length != 0) {
            Target = tag.shift()
            Search_Tag(Target, search_to_Left_Right(Target), LSpeed, RSpeed, FSpeed)
            Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, true)
            if (tag.length != 0) {
                if (tag[1] - Target > 2) {
                    Turn_90_Deg(RSpeed)
                    Line_Follow_Until_Tag(Current_Location, LSpeed, RSpeed, FSpeed, false)
                    home_calibration(LSpeed, RSpeed, FSpeed)
                    while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                    }
                    CUHK_JC_iCar.carStop()
                    Update_Pointing()
                }
                else {
                    switch1(tag[0], LSpeed, RSpeed, FSpeed, false)
                    while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
                    }
                    Turn_90_Deg(RSpeed)
                    Turn_90_Deg(RSpeed)
                    Line_Follow_Until_Tag(Current_Location, LSpeed, RSpeed, FSpeed, false)
                    home_calibration(LSpeed, RSpeed, FSpeed)
                    while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                    }
                    CUHK_JC_iCar.carStop()
                    Current_Location = end
                    Update_Pointing()
                }
            } else {
                Turn_90_Deg(RSpeed)
                Line_Follow_Until_Tag(Current_Location, LSpeed, RSpeed, FSpeed, false)
                home_calibration(LSpeed, RSpeed, FSpeed)
                while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                }
                CUHK_JC_iCar.carStop()
            }
        }
        for (let index = 0; index < 3; index++) {
            CUHK_JC_iCar.setHeadColor(0xff0000)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x0000ff)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(200)
        }
    }


    /**
    * Move iCar to array of points(A to H) using Rule-bases reasoning, click "+" to customize speed values
    */
    //% block="iCar deliver food to $location using RULE-based reasoning || at left turn speed %LSpeed\\%, right turn speed %RSpeed\\%, forward speed %FSpeed\\%"
    //% LSpeed.min=1 LSpeed.max=100 LSpeed.defl=20
    //% RSpeed.min=1 RSpeed.max=100 RSpeed.defl=20
    //% FSpeed.min=1 FSpeed.max=100 FSpeed.defl=20
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    //% group="iCar Food Delivery" blockGap=10
    export function rule(location: string[], LSpeed?: number, RSpeed?: number, FSpeed?: number): void {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
        tag = sort(location)
        Target = tag.shift()
        while (Target != 0) {
            if (Target <= 3) {
                Search_Tag(1, search_to_Left_Right(1), LSpeed, RSpeed, FSpeed)
                Line_Follow_Until_Tag(1, LSpeed, RSpeed, FSpeed, false)
                if (Target == 1) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                }
                forward_until_tag(1, FSpeed)
                Turn_90_Deg(RSpeed)
                CUHK_JC_iCar.headLightsOff()
                Line_Follow_Until_Tag(2, LSpeed, RSpeed, FSpeed, false)
                if (Target == 2) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                }
                CUHK_JC_iCar.headLightsOff()
                Line_Follow_Until_Tag(3, LSpeed, RSpeed, FSpeed, false)
                if (Target == 3) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                }
                CUHK_JC_iCar.headLightsOff()
                Pointing = 7
                Current_Location = 3
                while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
                }
                Turn_90_Deg(RSpeed)
                Turn_90_Deg(RSpeed)
                Line_Follow_Until_Tag(3, LSpeed, RSpeed, FSpeed, false)
                home_calibration(LSpeed, RSpeed, FSpeed)
                while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                }
                CUHK_JC_iCar.carStop()
            }
            else if ((Target == 5) || (Target == 6)) {
                Search_Tag(5, search_to_Left_Right(5), LSpeed, RSpeed, FSpeed)
                Line_Follow_Until_Tag(5, LSpeed, RSpeed, FSpeed, false)
                if (Target == 5) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }

                }
                forward_until_tag(5, FSpeed)
                Turn_90_Deg(RSpeed)
                CUHK_JC_iCar.headLightsOff()
                Line_Follow_Until_Tag(6, LSpeed, RSpeed, FSpeed, false)
                if (Target == 6) {
                    CUHK_JC_iCar.setHeadColor(0x00ff00)
                    basic.pause(1000)
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                }
                CUHK_JC_iCar.headLightsOff()
                Pointing = 2
                Current_Location = 6
                while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
                }
                Turn_90_Deg(RSpeed)
                Turn_90_Deg(RSpeed)
                Line_Follow_Until_Tag(6, LSpeed, RSpeed, FSpeed, false)
                home_calibration(LSpeed, RSpeed, FSpeed)
                while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                }
                CUHK_JC_iCar.carStop()
            }
            else {
                Search_Tag(Target, search_to_Left_Right(Target), LSpeed, RSpeed, FSpeed)
                Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, true)
                Turn_90_Deg(RSpeed)
                Pointing = Update_Pointing()
                CUHK_JC_iCar.headLightsOff()
                Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, false)
                home_calibration(LSpeed, RSpeed, FSpeed)
                while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                }
                CUHK_JC_iCar.carStop()
                if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
            }


        }
        for (let index = 0; index < 3; index++) {
            CUHK_JC_iCar.setHeadColor(0xff0000)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x0000ff)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(200)
        }
    }
    /**
    * Move iCar to array of points(A to H) using SKill-bases reasoning, click "+" to customize speed values
    */
    //% block="iCar deliver food to $location using SKILL-based reasoning || at left turn speed %LSpeed\\%, right turn speed %RSpeed\\%, forward speed %FSpeed\\%"
    //% LSpeed.min=1 LSpeed.max=100 LSpeed.defl=20
    //% RSpeed.min=1 RSpeed.max=100 RSpeed.defl=20
    //% FSpeed.min=1 FSpeed.max=100 FSpeed.defl=20
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    //% group="iCar Food Delivery" blockGap=10
    export function skill(location: string[], LSpeed?: number, RSpeed?: number, FSpeed?: number): void {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
        tag = sort(location)
        while (tag.length != 0) {
            Target = tag.shift()
            Search_Tag(Target, search_to_Left_Right(Target), LSpeed, RSpeed, FSpeed)
            Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, true)
            Turn_90_Deg(RSpeed)
            Pointing = Update_Pointing()
            CUHK_JC_iCar.headLightsOff()
            Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, false)
            home_calibration(LSpeed, RSpeed, FSpeed)
            while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
            }
            CUHK_JC_iCar.carStop()
        }
        for (let index = 0; index < 3; index++) {
            CUHK_JC_iCar.setHeadColor(0xff0000)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x0000ff)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(200)
        }
    }




}



