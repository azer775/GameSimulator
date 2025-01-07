import { CandlestickData } from "./CandlestickData";
import { News } from "./News";

export class CompanyDTO {
    
    name!: string;
    industry!: string;
    initialPrice!: number;
    volatility!: number;
    drift!: number;
    candlestickData!:CandlestickData[];
    news!: News[];
}