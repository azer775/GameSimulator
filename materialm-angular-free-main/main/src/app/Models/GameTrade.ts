import { Company } from "./Company";
import { GamePortfolio } from "./GamePortfolio";

export class Gametrade {
    id: number;
    position: string;
    shares: number;
    price: number;
    tradeDate: Date | string;
    portfolio: GamePortfolio;
    stopLoss?: number;
    takeProfit?: number;
    company: Company;
    state: string;
    latestPrice?: number;
}