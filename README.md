# 🚀 YuktiLens

### AI-Powered Predictive Market Intelligence Platform

---

## 📌 Overview

**YuktiLens** is an AI-driven market intelligence platform that goes beyond traditional analytics. Instead of just analyzing past data, YuktiLens predicts competitor strategies, simulates business decisions, and identifies market opportunities using multi-source data and large language models (LLMs).

---

## 🎯 Problem

Modern businesses rely on dashboards and analytics tools that are **reactive** — they explain what has already happened.

However, companies need answers to forward-looking questions such as:

* What will competitors do next?
* Should we launch a new feature?
* Is the market saturated?
* When is a competitor vulnerable?

There is no unified system that provides **predictive strategic intelligence**.

---

## 💡 Solution

YuktiLens combines **multi-source data collection + AI reasoning** to deliver actionable insights.

### Core Approach:

1. Collect real-world data from multiple sources (news, reviews, product updates)
2. Structure and process the data into usable intelligence
3. Use LLMs to generate predictions, insights, and strategic recommendations

---

## ⚙️ Key Features

### 🔮 Strategy Prediction Engine

Predicts the most likely next move of a competitor based on historical patterns and signals.

---

### 🎯 Decision Simulation Engine

Simulates business decisions before implementation.

* Example: “If we launch Feature X, what will happen?”
* Uses past competitor actions and outcomes to provide recommendations.

---

### ⚠️ Weak Phase Detection

Identifies when a competitor may be entering a vulnerable phase using signals like:

* Negative user reviews
* Pricing changes
* Declining trends

---

### 🔗 Multi-Source Intelligence

Collects and analyzes data from multiple real-world sources to ensure reliability and transparency.

---

### 📊 Market Visualization

Provides intuitive visual insights such as:

* Market positioning maps
* Trend distributions
* Competitive comparisons

---

## 🏗️ System Architecture

```
User Input (Industry / Company)
        ↓
Multi-Source Data Collection
        ↓
Data Processing & Structuring
        ↓
AI Intelligence Layer (LLM)
   ├── Strategy Prediction
   ├── Decision Simulation
   ├── Weak Phase Detection
        ↓
API Layer (FastAPI)
        ↓
Frontend Dashboard (React)
```

---

## 🧰 Tech Stack

### Backend

* FastAPI
* Python
* BeautifulSoup (Web Scraping)
* SerpAPI (Search Data)
* Gemini API (LLM)

### Frontend

* React.js
* Chart.js
* React Router

### Database

* JSON-based storage (for prototype)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/yuktilens.git
cd yuktilens
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
SERPAPI_KEY=your_serpapi_key_here
```

Run server:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

| Endpoint      | Method | Description               |
| ------------- | ------ | ------------------------- |
| `/companies`  | GET    | Get available companies   |
| `/analyze`    | POST   | Collect multi-source data |
| `/predict`    | POST   | Strategy prediction       |
| `/simulate`   | POST   | Decision simulation       |
| `/weak-phase` | POST   | Weak phase detection      |

---

## 🎯 Use Cases

* 📈 Startups planning product launches
* 🏢 Businesses analyzing competitors
* 📊 Strategy teams making data-driven decisions
* 💡 Market research and opportunity discovery

---

## 🏆 What Makes YuktiLens Unique

* Predictive, not reactive
* Decision simulation before execution
* Multi-source, evidence-backed intelligence
* AI-powered strategic reasoning
* Focus on actionable insights

---

## 🔮 Future Enhancements

* Real-time streaming data integration
* Advanced visualization dashboards
* Industry expansion beyond fintech
* AI-powered recommendation system
* Scalable database integration

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit pull requests.

---

## 📜 License

This project is for educational and hackathon purposes.

---

## 👨‍💻 Team

Developed as part of a hackathon project focused on AI-driven market intelligence.

---

## ✨ Tagline

> “Don’t just understand the market — stay ahead of it.”
