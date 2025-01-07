export class GameDTO {
    name!:string;
    startDate!:string;
    endDate!:string;
    virtualStartDate!:string;
    startingamount!:number;
    simulationDays!:number;
    candlesPerDay!:number;
    allowstoploss!:boolean;
    allowtakeprofit!:boolean;
    allowshortpos!:boolean;
    allowlongpos!:boolean;
}