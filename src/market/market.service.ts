import { Injectable } from '@nestjs/common';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class MarketService {
  constructor(private currencyService: CurrencyService) {}

  
}
