import Redis from 'ioredis';

// Singleton Redis instance mapped from environment variables
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class CurrencyService {
  private readonly CACHE_KEY = 'fx_rates';
  private readonly BASE_CURRENCY = 'NGN';

  /**
   * Fetches the latest exchange rates, prioritizing Redis cache over external API.
   */
  async getExchangeRates() {
    const cached = await redis.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // Mock API call to Free Currency API / OpenExchangeRates
    // e.g. axios.get(`https://api.exchangerate-api.com/v4/latest/${this.BASE_CURRENCY}`)
    const mockRates = {
      NGN: 1,
      GHS: 0.0095, // 1 NGN = 0.0095 GHS
      XOF: 0.42,   // 1 NGN = 0.42 XOF
      USD: 0.00065
    };

    // Cache for 1 hour (3600 seconds)
    await redis.setex(this.CACHE_KEY, 3600, JSON.stringify(mockRates));
    
    return mockRates;
  }

  /**
   * Converts an amount from NGN to the target currency
   */
  async convert(amountInNgn: number, targetCurrency: string): Promise<number> {
    if (targetCurrency === this.BASE_CURRENCY) return amountInNgn;
    
    const rates = await this.getExchangeRates();
    const rate = rates[targetCurrency];
    
    if (!rate) throw new Error(`Currency ${targetCurrency} is not supported`);
    
    return amountInNgn * rate;
  }
}

export const currencyService = new CurrencyService();
