export type SignalClass = 'BUY' | 'SELL' | 'HOLD';

export interface PricePoint {
  date: string;
  price: number;
  prediction: SignalClass;
}

export interface ModelMetrics {
  accuracy: number;
  f1Score: number;
  precision: { [key in SignalClass]: number };
  recall: { [key in SignalClass]: number };
}

export const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];

const getBasePrice = (ticker: string) => {
  switch (ticker) {
    case 'AAPL': return 180;
    case 'MSFT': return 350;
    case 'GOOGL': return 140;
    case 'TSLA': return 220;
    case 'NVDA': return 600;
    default: return 100;
  }
};

export function generateSimulationData(ticker: string, days: number = 180): PricePoint[] {
  const data: PricePoint[] = [];
  let currentPrice = getBasePrice(ticker);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simple random walk simulation
    const change = (Math.random() - 0.48) * (currentPrice * 0.02);
    currentPrice += change;
    
    // Simulate SVM logic: Buy on support/uptrend, Sell on resistance/downtrend
    let prediction: SignalClass = 'HOLD';
    if (change > currentPrice * 0.008) prediction = 'BUY';
    else if (change < -currentPrice * 0.008) prediction = 'SELL';

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      prediction,
    });
  }

  return data;
}

export function getModelMetrics(): ModelMetrics {
  return {
    accuracy: 84.5,
    f1Score: 0.82,
    precision: {
      BUY: 0.86,
      SELL: 0.79,
      HOLD: 0.81,
    },
    recall: {
      BUY: 0.82,
      SELL: 0.84,
      HOLD: 0.80,
    },
  };
}

export const CONFUSION_MATRIX = [
  [45, 5, 10], // HOLD Actual: [HOLD, BUY, SELL] Predicted
  [8, 52, 5],  // BUY Actual
  [12, 3, 40], // SELL Actual
];