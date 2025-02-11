import pandas as pd
from geopy.distance import geodesic
import time

# Start the timer
start_time = time.time()

# Load your data into a DataFrame
df = pd.read_csv(r"C:\Users\rekha\OneDrive\Desktop\VehicleHaltDetection\VTS_Data_IOC_Pune_terminal.csv")

# Convert 'date_created' to datetime
df['date_created'] = pd.to_datetime(df['date_created'], format='%d-%m-%Y %H:%M')

# Sort data by 'trip_id', 'vehicle_number', and 'date_created'
df.sort_values(by=['trip_id', 'vehicle_number', 'date_created'], inplace=True)

# Initialize a list to store halt details
halts = []

# Define thresholds
distance_threshold = 10  # meters
time_threshold = 5  # minutes

# Iterate over each trip's data
for trip_id in df['trip_id'].unique():
    trip_data = df[df['trip_id'] == trip_id]
    
    for i in range(1, len(trip_data)):
        previous_point = trip_data.iloc[i-1]
        current_point = trip_data.iloc[i]
        
        # Calculate time difference in minutes (truncate to full minutes)
        time_diff = int((current_point['date_created'] - previous_point['date_created']).total_seconds() // 60)
        
        # Calculate distance between points in meters
        distance = geodesic(
            (previous_point['latitude'], previous_point['longitude']),
            (current_point['latitude'], current_point['longitude'])
        ).meters
        
        # Check if the vehicle is stationary (e.g., distance < 10 meters and time_diff > 2 minutes)
        if distance < distance_threshold and time_diff > time_threshold:
            halt_info = {
                'trip_id': trip_id,
                'vehicle_number': previous_point['vehicle_number'],
                'latitude': previous_point['latitude'],
                'longitude': previous_point['longitude'],
                'halt_start_time': previous_point['date_created'],
                'halt_end_time': current_point['date_created'],
                'halt_duration_minutes': time_diff,
                'location_id': previous_point['location_id'],
                'fan_invoice_number': previous_point['fan_invoice_number'],
                'name': previous_point['name']
            }
            halts.append(halt_info)

# Convert the halt details to a DataFrame
halts_df = pd.DataFrame(halts)

# Check if halts_df is empty
if halts_df.empty:
    print("No halts detected. Please check your input data.")
else:
    # Count the number of halts per vehicle
    halt_counts = halts_df.groupby(['trip_id', 'vehicle_number']).size().reset_index(name='halt_count')

    # Merge halt counts with halts details
    result_df = pd.merge(halts_df, halt_counts, on=['trip_id', 'vehicle_number'])

    # Export the result to a CSV file
    result_df.to_csv('Pune_Total_Halts.csv', index=False)

    print("Halt details successfully exported to 'Pune_Total_Halts.csv.csv'.")
