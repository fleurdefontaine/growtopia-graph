# Growtopia Online User

This Node.js application tracks the number of online users in Growtopia and generates a graph to visualize the data over time.

## Features

- Fetches online user count from Growtopia's API every 3 minutes
- Stores data for the last 15 minutes
- Generates a line graph showing the trend of online users
- Displays changes in user count on the graph

## Prerequisites

Before running this application, make sure you have Node.js installed on your system.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/fleurdefontaine/growtopia-graph.git
   ```

2. Navigate to the project directory:
   ```bash
   cd growtopia-graph
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application, run:

```bash
node index.js
```

The application will start fetching data every 3 minutes and generate a graph named `graph.png` in the project directory.

## Graph

The generated graph includes:

- A line chart showing the number of online users over time
- Tooltips displaying the exact number of users for each data point
- Labels showing the change in user count (increase or decrease)