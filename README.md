# ✈️ Airline Management System

A comprehensive airline booking and management system built with **TypeScript**, featuring flight scheduling, passenger management, and seat booking capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Core Models](#-core-models)
- [Services](#-services)
- [Data Storage](#-data-storage)
- [Development](#-development)
- [License](#-license)

## ✨ Features

### Flight Management
- ✅ Create and manage flights with detailed information
- ✅ Track flight status (scheduled, boarding, departed, cancelled)
- ✅ Monitor seat availability and capacity
- ✅ Delay flights and update schedules
- ✅ Cancel flights with proper validation

### Passenger Management
- ✅ Register passengers with personal details
- ✅ Store passport information
- ✅ Track passenger bookings
- ✅ Update passenger information

### Booking System
- ✅ Book seats on available flights
- ✅ Cancel bookings with automatic seat release
- ✅ View booking history by flight or passenger
- ✅ Generate booking summaries and statistics
- ✅ Prevent double-booking and overbooking

### Interactive CLI
- ✅ User-friendly command-line interface
- ✅ Menu-driven navigation
- ✅ Real-time data validation
- ✅ Clear error messaging

## 📁 Project Structure

```
airline-ts/
├── src/
│   ├── app/                    # Application layer
│   │   ├── main.ts            # Main entry point
│   │   ├── bookingMenu.ts     # Booking management UI
│   │   ├── flightMenu.ts      # Flight management UI
│   │   ├── passengerMenu.ts   # Passenger management UI
│   │   ├── cliHelper.ts       # CLI utility functions
│   │   └── io.ts              # Input/output handlers
│   ├── models/                 # Domain models
│   │   ├── Flight.ts          # Flight entity
│   │   ├── Passenger.ts       # Passenger entity
│   │   └── Seat.ts            # Seat entity
│   ├── services/               # Business logic
│   │   ├── BookingServices.ts # Booking operations
│   │   ├── FlightServices.ts  # Flight operations
│   │   ├── PassengerServices.ts # Passenger operations
│   │   └── SeatServices.ts    # Seat operations
│   └── index.ts               # Application bootstrap
├── data/                       # JSON data storage
│   ├── bookings.json
│   ├── flights.json
│   ├── passengers.json
│   └── seats.json
├── dist/                       # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **TypeScript** (v5.9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airline-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   tsc
   ```
   
   Or run in watch mode for development:
   ```bash
   tsc -w
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 💻 Usage

### Starting the Application

```bash
npm start
```
