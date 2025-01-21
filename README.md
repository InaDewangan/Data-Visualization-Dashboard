# Data Visualization Dashboard

## Overview
The Data Visualization Dashboard is an interactive web application designed to provide insightful data visualizations with advanced filtering options. The project is built using React for the frontend, Firebase for user authentication, and JSON Server for data storage. The dashboard includes features such as interactive charts, advanced filtering, cookie management, responsiveness, user authentication, and URL sharing.

## Features

### 1. Interactive Data Visualization
- **Bar Chart**: Represents various features (A, B, C, etc.) on the x-axis with the total time spent between the selected date range.
- **Line Chart**: Displays the time trend of a particular category upon clicking on the bar chart. Includes pan, zoom-in, and zoom-out options on the time range.

### 2. Advanced Filtering
- **Age Filter**: Filter data by age groups (15-25, >25).
- **Gender Filter**: Filter data by gender (male, female).
- **Date Range Selector**: Allows users to choose a specific time range for analytics data. The graph updates based on the selected time range and filters.

### 3. Cookie Management
- Stores user preferences for filters and date range in cookies.
- Automatically applies previous settings when users revisit the page.
- Provides an option for users to reset or clear their preferences.

### 4. Responsiveness
- Ensures the frontend application works seamlessly on various devices, including desktops, tablets, and mobiles.

### 5. User Authentication
- Basic user login interface.
- Users can sign up, log in, and log out using Firebase authentication.

### 6. URL Sharing
- Users can share a chart created with a specific date range and filters via a URL.
- The recipient must log in to view the chart due to data confidentiality.

### 7. Dark and Light Mode
- Users can switch between dark and light modes for a better user experience.

## Technologies Used
- **Frontend**: React
- **User Authentication**: Firebase
- **Data Storage**: JSON Server
