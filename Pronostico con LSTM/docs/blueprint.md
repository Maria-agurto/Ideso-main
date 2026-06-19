# **App Name**: InverPulse Predictor

## Core Features:

- Hybrid Regression Visualizer: A high-performance Plotly dashboard displaying a dual time series chart that compares actual OHLCV values with predicted LSTM outputs.
- Intelligent Horizon Adjustment Tool: An AI-powered tool that allows users to shift forecasting horizons (7, 14, 30, 60 days) and recalculate standard deviation confidence bands on-the-fly.
- Deep Learning Config Insight: An interactive UI panel detailing the underlying LSTM architecture, including dropout rates, epoch settings, and ReLU dense layer configurations.
- Predictive Performance Dashboard: Real-time metrics tracking RMSE, MAE, R-squared, and Directional Accuracy using tool-assisted data evaluation with green/red status indicators.
- Historical Ticker Repository: Management and storage of financial asset data including AAPL, BTC-USD, and MSFT via a Firebase-powered data source.
- Data Integration Engine: Leverages Firestore and Firebase services to maintain continuous historical data windows of up to 2 years for model input.

## Style Guidelines:

- Primary color is an institutional deep blue (#1F3864) for trust, with a predictive red accent (#EF5350) to highlight regressed forecasts.
- Background follows a crisp light theme with a subtly tinted off-white (#F7F9FB) for high clarity in data dense environments.
- A technical font pairing: 'Space Grotesk' for geometric headlines and numeric indicators, and 'Inter' for administrative dashboard content.
- Modern responsive CSS Grid implementation using a 4-column metrics panel above a centralized high-aspect-ratio visualization.
- Soft transitions and buttery-smooth re-drawing for prediction bands when the slider horizon values change.
- Minimalistic line-weight icons for financial metrics and network architectural components.