import { askQuestion } from "./io.js";
import { addPassenger, getAllPassengers, getPassengerById, updatePassenger, removePassenger } from "../services/PassengerServices.js";
import { PassengerData } from "../models/Passenger.js";


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