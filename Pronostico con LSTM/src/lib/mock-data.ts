import { addDays, format, subDays } from "date-fns";

export interface DataPoint {
  date: string;
  actual?: number;
  predicted?: number;
  upper?: number;
  lower?: number;
  isForecast: boolean;
}

export const generateMockData = (ticker: string, horizon: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const now = new Date();
  const historicalDays = 90;
  
  // Base prices per ticker
  const basePrices: Record<string, number> = {
    "AAPL": 180,
    "BTC-USD": 45000,
    "ETH-USD": 2500,
    "MSFT": 400,
    "NVDA": 800
  };

  const basePrice = basePrices[ticker] || 100;
  const volatility = ticker.includes("USD") ? 0.03 : 0.015;
  const drift = 0.0005; // Moderate bullish drift

  let currentPrice = basePrice;
  
  // Historical data
  for (let i = historicalDays; i >= 0; i--) {
    const date = subDays(now, i);
    // Random walk
    const change = currentPrice * (drift + volatility * (Math.random() - 0.45));
    currentPrice += change;
    
    points.push({
      date: format(date, "yyyy-MM-dd"),
      actual: parseFloat(currentPrice.toFixed(2)),
      isForecast: false
    });
  }

  // Future predictions
  let forecastPrice = currentPrice;
  const stdDev = basePrice * volatility * 2.5;

  for (let i = 1; i <= horizon; i++) {
    const date = addDays(now, i);
    // Prediction follows a smoother path but diverges from actual potential
    const forecastChange = forecastPrice * (drift + (volatility * 0.5) * (Math.random() - 0.45));
    forecastPrice += forecastChange;

    // Uncertainty increases with time
    const uncertainty = (stdDev * i) / horizon;

    points.push({
      date: format(date, "yyyy-MM-dd"),
      predicted: parseFloat(forecastPrice.toFixed(2)),
      upper: parseFloat((forecastPrice + uncertainty).toFixed(2)),
      lower: parseFloat((forecastPrice - uncertainty).toFixed(2)),
      isForecast: true
    });
  }

  return points;
};

export const getModelMetrics = (ticker: string) => {
  // Return different metrics based on ticker for realism
  const isCrypto = ticker.includes("USD");
  return {
    rmse_usd: isCrypto ? 142.50 : 2.45,
    rmse_percentage: isCrypto ? 3.2 : 1.1,
    mae_usd: isCrypto ? 98.20 : 1.80,
    r_squared: 0.94,
    directional_accuracy_percentage: 68.5,
  };
};
