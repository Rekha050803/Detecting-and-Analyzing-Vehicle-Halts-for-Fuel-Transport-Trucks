# 🚛 Detecting and Analyzing Vehicle Halts for Fuel Transport Trucks

## 📌 Introduction
The **Halt Detection System** is designed to monitor and analyze vehicle stops during fuel transport operations. It detects unauthorized halts using GPS data and alerts fleet managers if a vehicle stops in unapproved locations. By integrating geospatial analysis and Google Maps API, this system enhances security, operational efficiency, and compliance monitoring.

---

## 🚀 Features
- **✅Real-Time Vehicle Tracking**: Uses GPS data to monitor vehicle movements.
- **✅Unauthorized Halt Detection**: Identifies and flags stops exceeding predefined time and location thresholds.
- **✅Geospatial Analysis**: Determines proximity to authorized locations (fuel stations, terminals, rest areas).
- **✅Interactive Visualization**: Displays routes and halt points on Google Maps.
- **✅Report Generation**: Outputs detailed CSV reports of halt events.

---

## 🛠️ Technologies Used
- **Languages**: JavaScript, HTML, CSS
- **Libraries**: 
  - 🐍 Pandas (for data processing)
  - 🌍 Geopy (for distance calculations)
  - 🔢 NumPy (for numerical operations)
  - 🗺️ Google Maps JavaScript API (for mapping & halt detection visualization)
- **💾 Data Storage**: CSV files for storing tracking and halt detection data

---

## 🚀 Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/your-repository.git
   ```
2. Open the project folder and launch the index.html file in a browser.
3. Ensure API keys for Google Maps are configured properly.
4. Load the tracking data (CSV files) into the system.

---

## 🛠️ Usage
1. Upload vehicle tracking data.
2. The system analyzes movement and detects halts.
3. View detected halts on an interactive map.
4.  Export halt reports for further analysis.

---

## 🧮 Algorithm Used
- **Geodesic Distance Calculation**: Uses the Haversine formula to measure distances between two gps points.
- **Threshold-Based Detection**: Identifies stops based on time (>5 mins) and distance (<10m).
- **Proximity Filtering**: Excludes stops near authorized locations (within 500m).


