import { getRedis } from '../lib/redis.js';

export class CurrencyService {
  private readonly CACHE_KEY = 'fx_rates';
  private readonly BASE_CURRENCY = 'NGN';

  async getExchangeRates() {
    const redis = getRedis();
    const cached = await redis.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const mockRates = {
      NGN: 1,
      GHS: 0.0095,
      XOF: 0.42,
      USD: 0.00065,
    };

    await redis.setex(this.CACHE_KEY, 3600, JSON.stringify(mockRates));

    return mockRates;
  }

  async convert(amountInNgn: number, targetCurrency: string): Promise<number> {
    if (targetCurrency === this.BASE_CURRENCY) return amountInNgn;

    const rates = await this.getExchangeRates();
    const rate = rates[targetCurrency];

    if (!rate) throw new Error(`Currency ${targetCurrency} is not supported`);

    return amountInNgn * rate;
  }
}

export const currencyService = new CurrencyService();
