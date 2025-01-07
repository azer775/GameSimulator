import { Game } from "./Game";
import { News } from "./News";

export class Company{
    id!: number;
    name!: string;
    sector!: string;
    marketCap!:number;
    game!:Game;
    peRatio!:number;
    debtToEquity!:number;
    eps!:number;
    dividendYield!:number;
    stockFilePath!:string;
    news!: News[];
}