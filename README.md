# 🏗️ Nirmaan AI: Satellite-Powered Construction Monitoring

**Nirmaan AI** is a state-of-the-art monitoring platform designed for government officials to oversee public amenity construction projects using **AI-analyzed satellite imagery**. By bridging the gap between reported progress and ground reality, Nirmaan AI ensures total transparency in public works.

![Platform Preview](https://raw.githubusercontent.com/jenniyoo17/nirmaan_ai/main/preview.png) *(Note: Add a screenshot of your dashboard here)*

## 🚀 Core Features

*   **🛰️ Real-Time Satellite Intelligence**: Automatically fetches high-resolution satellite imagery (Sentinel-2/Esri) during project registration to establish a baseline.
*   **🤖 AI Progress Tracking**: A computer vision engine that calculates physical completion percentages based on pixel-level structural changes.
*   **⚠️ Anomaly & Fraud Detection**: Automatically flags suspicious activities, such as stagnant progress or site demolition, preventing the misuse of public funds.
*   **📊 Executive Dashboard**: A premium, neon-themed interface for tracking project portfolios, budgets, and historical timelines.
*   **📍 Interactive GIS Targeting**: Map-based project initialization with instant "Satellite Shot" previews.

## 🛠️ Technology Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** (Premium UI Design)
- **Leaflet & React-Leaflet** (GIS & Mapping)
- **Recharts** (Data Visualization)
- **Axios** (API Communication)

### Backend
- **FastAPI** (Python High-Performance Framework)
- **SQLAlchemy** (Database ORM)
- **SQLite** (Persistent Storage)
- **OpenCV & NumPy** (AI/Image Analysis Engine)
- **Requests** (Satellite Data Fetching)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jenniyoo17/nirmaan_ai.git
cd nirmaan_ai
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Optional: Set your Google Maps API Key for better imagery
# export GOOGLE_MAPS_API_KEY='your_key_here'
python -m uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Database Initialization
Once the backend is running, visit:
`http://localhost:8000/seed` 
This will populate your dashboard with 5 sample projects and historical AI data.

## 🎯 How to Use

1.  **Monitor**: Open the **Admin Dashboard** to see current project statuses and global progress.
2.  **Analyze**: Click **"View AI Analysis"** on any project to see the side-by-side satellite feed and AI vision logs.
3.  **Register**: Go to **"Register New Amenity"**, pick a spot on the map, and click **"Lock Target"** to see the live satellite preview before finalizing.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Built with ❤️ for Government Transparency.**
