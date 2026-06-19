# **App Name**: InvestAI Predict

## Core Features:

- SVC Historical Trend Map: Interactive price line chart with markers for BUY (green), SELL (red), and HOLD (gray) using Plotly.js for real-time visualization.
- Model Diagnostics Suite: Display real-world model metrics including F1-Score, accuracy, precision, and recall per trading signal class.
- Trend Analysis AI Tool: An AI tool that provides a natural language summary of why the SVM model is predicting a specific signal based on historical 60-day price window patterns.
- Interactive Confusion Matrix: Heatmap visualization of a 3x3 matrix to analyze prediction performance between classes for better quant evaluation.
- High-Confidence Signal Semaphore: A high-visibility dashboard indicator showing current action (BUY/SELL/HOLD) for the selected ticker and date.
- Ticker Portfolio Selector: Seamless dropdown menu to switch between primary financial assets including AAPL, MSFT, GOOGL, TSLA, and NVDA.

## Style Guidelines:

- Primary color: Institutional Navy Blue (#1F3864) evoking stability and depth.
- Background color: Clean Gallery White (#FFFFFF) to ensure high readability and a minimalist financial interface.
- Accent color: Refined Gold (#C5961A) for call-to-actions and sophisticated visual highlights.
- Body and Headline font: 'Inter', a grotesque sans-serif that provides a machined and objective look suitable for complex data-driven financial tools.
- Geometrically distinct markers: Upward triangles for BUY, downward for SELL, and soft circles for HOLD to provide instant visual clarity.
- Modular grid layout with focused signal components in the hero area, flanked by technical metrics for the quantitative user.
- Soft CSS transitions for chart resizing and signal status changes, ensuring the interface feels responsive and alive.