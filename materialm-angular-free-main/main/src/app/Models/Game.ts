export class Game{
    id!: number;
    name!:string;
    startDate!:Date;
    endDate!:Date;
    virtualStartDate!:Date;
    startingamount!:number;
    uniqueCode!:string;
    simulationDays!:number;
    candlesPerDay!:number;
    allowstoploss!:boolean;
    allowtakeprofit!:boolean;
    allowshortpos!:boolean;
    allowlongpos!:boolean;
}