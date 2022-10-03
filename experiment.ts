//% color="#EC7482" weight=4 icon="\uf0c3" block="CUHK_JC_iCar_Experiments"

namespace CUHK_JC_iCar_Experiments{ 
  let Current_Location = 0
  export enum reason {
      //% block="Skill-based"
      skill = 1,
      //% block="Rule-based"
      rule = 2,
      //% block="Knowledge-based"
      knowledge = 3
  }
  /**
  * Move iCar to array of points(A to H) using SKill, Rule or Knowledge-bases reasoning, click "+" to customize speed values
  */
  //% block="iCar deliver food to $location using %index reasoning || at left speed %LSpeed\\%, right speed %RSpeed\\%, forward speed %FSpeed\\%"
  //% LSpeed.min=1 LSpeed.max=100 LSpeed.defl=20
  //% RSpeed.min=1 RSpeed.max=100 RSpeed.defl=20
  //% FSpeed.min=1 FSpeed.max=100 FSpeed.defl=20
  //% inlineInputMode=inline
  //% expandableArgumentMode="toggle"
  //% group="iCar Food Delivery" blockGap=10
  export function startProgram(location: string[], index?: reason, LSpeed?: number,RSpeed?: number,FSpeed?: number): void {
    if (input.buttonIsPressed(Button.A)){
      huskylens.initI2c()
      huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
      Current_Location = 0
      if(index == 1){
      
      }
      if(index == 2){
      
      }
      else{
      
      }
    }
  }
    
  /**
  * Sample points of delivering to A, B, F, G
  */ 
  //% block="A,B,F,G"
  //% group="iCar Food Delivery" blockGap=10
  export function ABFG(): string[] {
    return ["a","b","f","g"];
  }
}
