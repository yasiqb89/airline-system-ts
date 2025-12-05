import { askQuestion } from "./io.js";
import { addPassenger, getAllPassengers, getPassengerById, updatePassenger, removePassenger } from "../services/PassengerServices.js";
import { PassengerData } from "../models/Passenger.js";
import { getFlightById, addFlight, updateFlight, removeFlight, getAllFlights } from "../services/FlightServices.js";
import { FlightData } from "../models/Flight.js";
import { FlightStatus } from "../models/Flight.js";


export async function AddNewPassengerCli(): Promise<void> {
    console.log("\n-- Add New Passenger --");

    const name = (await askQuestion("Name: ")).trim();
    const ageInput = (await askQuestion("Age: ")).trim();
    const passport = (await askQuestion("Passport Number: ")).trim();

    const age = Number(ageInput);

    if (!name || !passport || Number.isNaN(age)) {
        console.log("Invalid input. Please provide valid name, age (number), and passport number.");
        return;
    }
    const passengerId = Math.max(...(await getAllPassengers()).map(p => p.id)) + 1;
    const passengerInfo: PassengerData = { id: passengerId, name, age, passportNumber: passport };

    const newPassenger = await addPassenger(passengerInfo);
    console.log("Passenger added successfully:");
    console.log(newPassenger.info);

}

export async function getAllPassengersCli(): Promise<void> {
    const passengers = await getAllPassengers();
    if (passengers.length === 0) {
        console.log("No passengers found.");
    } else {
        console.log("\n-- Passenger List --");
        passengers.forEach(p => console.log(p.info));
    }
}

export async function getPassengerByIdCli(): Promise<void> {
    const rawId = (await askQuestion("Enter Passenger ID: ")).trim();
    const id = Number(rawId);

    if (!Number.isFinite(id)) {
        console.log("Invalid input. Please provide a valid number.");
        return;
    }

    const passenger = await getPassengerById(id);
    if (!passenger) {
        console.log("Passenger not found.");
    } else {
        console.log("\n-- Passenger --");
        console.log(passenger.info);
    }
}

export async function updatePassengerCli(): Promise<void> {
    console.log("\n-- Update Passenger --");
    const rawId = (await askQuestion("Enter Passenger ID to update: ")).trim();
    const id = Number(rawId);

    if (!Number.isInteger(id)) {
        console.log("Invalid ID.");
        return;
    }

    const existing = await getPassengerById(id);
    if (!existing) {
        console.log(`⚠️ No passenger found with ID ${id}.`);
        return;
    }

    console.log("Leave field blank to keep current value.");

    const newName = (await askQuestion(`Name (${existing.name}): `)).trim();
    const newAgeRaw = (await askQuestion(`Age (${existing.age}): `)).trim();
    const newPassport = (await askQuestion(`Passport (${existing.passportNumber}): `)).trim();

    const updates: Partial<PassengerData> = {};

    if (newName) updates.name = newName;
    if (newAgeRaw) {
        const newAge = Number(newAgeRaw);
        if (Number.isInteger(newAge)) updates.age = newAge;
    }
    if (newPassport) updates.passportNumber = newPassport;

    if (Object.keys(updates).length === 0) {
        console.log("No updates provided.");
        return;
    }

    const updated = await updatePassenger(id, updates);
    if (updated) {
        console.log("Passenger updated:");
        console.log(updated.info);
    } else {
        console.log("Failed to update passenger.");
    }
}

export async function removePassengerCli(): Promise<void> {
    console.log("\n-- Remove Passenger --");
    const rawRemoveId = (await askQuestion("Enter Passenger ID to remove: ")).trim();
    const removeId = Number(rawRemoveId);

    if (!Number.isInteger(removeId)) {
        console.log("Invalid ID.");
        return;
    }

    const confirm = (await askQuestion("Are you sure you want to delete this passenger? (y/n): ")).trim().toLowerCase();
    if (confirm !== "y") {
        console.log("Cancelled.");
        return;
    }

    const removed = await removePassenger(removeId);

    if (removed) {
        console.log(`Done: Passenger ID ${removeId} removed.`);
    } else {
        console.log(`Error: Passenger ID ${removeId} not found.`);
    }
}

export async function getAllFlightsCli(): Promise<void> {
    const flights = await getAllFlights();
    if (flights.length === 0) {
        console.log("No flights found.");
    } else {
        console.log("\n-- Flight List --");
        flights.forEach(f => console.log(f.info));
    }
}

export async function getFlightByIdCli(): Promise<void> {
    console.log("\n-- Get Flight by ID --");
    const rawId = (await askQuestion("Enter Flight ID: ")).trim();
    const id = Number(rawId);

    if (!Number.isInteger(id)) {
        console.log("Invalid ID.");
        return;
    }

    const flight = await getFlightById(id);
    if (!flight) {
        console.log(`No flight found with ID ${id}.`);
        return;
    }

    console.log("\n-- Flight --");
    console.log(flight.info);

}

export async function addFlightCli(): Promise<void> {
    console.log("\n-- Add Flight --");
    console.log("Date format: YYYY-MM-DDTHH:MM:SS (e.g., 2025-03-15T09:30:00)");

    const flightNumber = (await askQuestion("Flight Number: ")).trim();
    const origin = (await askQuestion("Origin: ")).trim();
    const destination = (await askQuestion("Destination: ")).trim();
    const departureTime = (await askQuestion("Departure Time: ")).trim();
    const arrivalTime = (await askQuestion("Arrival Time: ")).trim();
    const capacityInput = (await askQuestion("Capacity: ")).trim();
    const bookedSeatsInput = (await askQuestion("Booked Seats: ")).trim();

    // Validate basic inputs
    if (!flightNumber || !origin || !destination || !departureTime || !arrivalTime) {
        console.log("Error: All fields are required.");
        return;
    }

    // Validate capacity and booked seats
    const capacity = Number(capacityInput);
    const bookedSeats = Number(bookedSeatsInput);

    if (!Number.isInteger(capacity) || capacity <= 0) {
        console.log("Error: Capacity must be a positive integer.");
        return;
    }

    if (!Number.isInteger(bookedSeats) || bookedSeats < 0) {
        console.log("Error: Booked seats must be a non-negative integer.");
        return;
    }

    if (bookedSeats > capacity) {
        console.log("Error: Booked seats cannot exceed capacity.");
        return;
    }

    // Validate departure time
    const depDate = new Date(departureTime);
    if (isNaN(depDate.getTime())) {
        console.log("Error: Invalid departure time format. Use YYYY-MM-DDTHH:MM:SS (e.g., 2025-03-15T09:30:00)");
        return;
    }

    // Validate arrival time
    const arrDate = new Date(arrivalTime);
    if (isNaN(arrDate.getTime())) {
        console.log("Error: Invalid arrival time format. Use YYYY-MM-DDTHH:MM:SS (e.g., 2025-03-15T14:30:00)");
        return;
    }

    // Check if arrival is after departure
    if (arrDate <= depDate) {
        console.log("Error: Arrival time must be after departure time.");
        return;
    }

    const flightStatus = "scheduled";

    const flightInfo: Omit<FlightData, 'id'> = {
        flightNumber: flightNumber,
        origin: origin,
        destination: destination,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        capacity: capacity,
        bookedSeats: bookedSeats,
        status: flightStatus
    };

    const newFlight = await addFlight(flightInfo);
    if (!newFlight) {
        console.log("Failed to add flight.");
        return;
    }

    console.log("\nFlight added successfully!");
    console.log(newFlight.info);
}


export async function updateFlightCli(): Promise<void> {
    console.log("\n-- Update Flight--");

    const flights = await getAllFlights();
    if (!flights) {
        console.log("No flights available ! ");
        return;
    }

    flights.forEach(f => {
        console.log(f.info);
    });

    const rawId = (await askQuestion("Flight ID: ")).trim();
    const flightId = Number(rawId);
    if (!Number.isInteger(flightId) || !flightId) {
        console.log("Invalid or No ID.")
        return;
    }

    const existing = await getFlightById(flightId);
    if (!existing) {
        console.log(`No flightsfound with ID ${flightId}.`)
        return;
    }

    console.log("Leave field blank to keep current value.");

    const newFlightNumber = (await askQuestion(`Flight Number (${existing?.flightNumber}): `)).trim();
    const newOrigin = (await askQuestion(`Origin (${existing?.origin}): `)).trim();
    const newDestination = (await askQuestion(`Destination (${existing?.destination}): `)).trim();
    const newdepartureTime = (await askQuestion(`Departure Time (${existing?.departureTime}): `)).trim();
    const newArrivalTime = (await askQuestion(`Arrival Time (${existing?.arrivalTime}): `)).trim();
    const newStatus = (await askQuestion(`Status [scheduled/boarding/departed/cancelled] (${existing?.status}): `)).trim();

    const updates: Partial<FlightData> = {}

    if (newFlightNumber) updates.flightNumber = newFlightNumber;
    if (newOrigin) updates.origin = newOrigin;
    if (newDestination) updates.destination = newDestination;


    if (newdepartureTime) {
        const depDate = new Date(newdepartureTime);
        if (isNaN(depDate.getTime())) {
            console.log("Warning: Invalid departure time format. Skipping this field.");
        } else {
            updates.departureTime = newdepartureTime;
        }
    }

    if (newArrivalTime) {
        const arrDate = new Date(newArrivalTime);
        if (isNaN(arrDate.getTime())) {
            console.log("Warning: Invalid arrival time format. Skipping this field.");
        } else {
            updates.arrivalTime = newArrivalTime;
        }
    }

    if (newStatus) {
        const validStatuses: string[] = ["scheduled", "boarding", "departed", "cancelled"];
        if (validStatuses.includes(newStatus)) {
            updates.status = newStatus as "scheduled" | "boarding" | "departed" | "cancelled";
        } else {
            console.log(`Warning: Invalid status "${newStatus}". Must be one of: scheduled, boarding, departed, cancelled. Skipping this field.`);
        }
    }

    if (Object.keys(updates).length === 0) {
        console.log("No updates provided.");
        return;
    }

    const updated = await updateFlight(flightId, updates);

    if (updated) {
        console.log("Flight updated successfully:");
        console.log(updated.info);
    } else {
        console.log("Failed to update flight.");
        return;
    }

}


export async function removeFlightCli(): Promise<void> {
    console.log("\n-- Remove Flight--");
    const flights = await getAllFlights();
    if (!flights) {
        console.log("No flights available ! ");
        return;
    }

    flights.forEach(f => {
        console.log(f.info);
    });

    const rawId = (await askQuestion("Flight ID: ")).trim();
    const flightId = Number(rawId);
    if (!Number.isInteger(flightId) || !flightId) {
        console.log("Invalid or No ID.")
        return;
    }

    const existing = await getFlightById(flightId);
    if (!existing) {
        console.log(`No Flights found with ID ${flightId}.`)
        return;
    }

    const removed = await removeFlight(flightId);
    if (removed) {
        console.log("Flight removed successfully.");
    } else {
        console.log("Failed to remove flight.");
        return;
    }
}
