import { readFile, writeFile } from "fs/promises";
import Passenger, { PassengerData } from "../models/Passenger.js";

// File path JSON
const filePath = new URL('../../data/passenger.json', import.meta.url);


export async function getAllPassengers(): Promise<Passenger[]> {
    try {
        const data = await readFile(filePath, 'utf-8');
        const rawData: PassengerData[] = JSON.parse(data);
        return rawData.map(obj => Passenger.fromPlain(obj));

    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw error;

    }
}


export async function getPassengerById(passengerId: number): Promise<Passenger | null> {

    const id = Number(passengerId);
    if (Number.isNaN(id)) return null;

    const allPassengers = await getAllPassengers();
    const passenger = allPassengers.find(p => p.id === id);
    if (!passenger) return null;

    return passenger;
}


export async function addPassenger(data: PassengerData): Promise<Passenger> {
    const allPassengers = await getAllPassengers();

    const maxId = allPassengers.length > 0 ? Math.max(...allPassengers.map(p => p.id)) : 0;
    const nextId = maxId + 1;

    const passengerInfo = {
        id: nextId,
        name: data.name,
        age: data.age,
        passportNumber: data.passportNumber
    }

    const newPassenger = new Passenger(passengerInfo);

    allPassengers.push(newPassenger);

    const plainToSave = allPassengers.map(p => p.toJSON);

    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), 'utf-8');

    return newPassenger;
}


async function updatePassenger(passengerId: number, updates: Partial<PassengerData>): Promise<Passenger | null> {
    const id = Number(passengerId);
    if (Number.isFinite(id)) return null;

    const passengers = await getAllPassengers();

    const index = passengers.findIndex(p => p.id === id);
    if (index === -1) {
        return null;
    }

    const existing = passengers[index];
    const merged: PassengerData = {
        id: existing.id,
        name: updates.name ?? existing.name,
        age: updates.age ?? existing.age,
        passportNumber: updates.passportNumber ?? existing.passportNumber,
    };

    const updatedPassenger = new Passenger(merged);
    passengers[index] = updatedPassenger;

    const plainToSave: PassengerData[] = passengers.map(p => p.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), "utf-8");

    return updatedPassenger;
}


async function removePassenger(passengerId: number): Promise<boolean | null> {
    const id = Number(passengerId);
    if (!Number.isFinite(id)) return null;

    const passengers = await getAllPassengers();
    const filtered = passengers.filter(p => p.id !== id);
    if (filtered.length === passengers.length) return false;

    const plainToSave: PassengerData[] = filtered.map(p => p.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), 'utf-8');

    return true;
}




// Test code (only runs when this file is executed directly)
if (import.meta.url === `file://${process.argv[1]}`) {
    // console.log("Running PassengerServices test...");

    // const result = await getAllPassengers();
    // console.log("Loaded passengers:", result.length);

    // if (result[0]) {
    //     console.log("First passenger info:", result[0].info);
    //     console.log("Instance of Passenger:", result[0] instanceof Passenger);
    // } else {
    //     console.log("No passengers found.");
    // }

    console.log("Running removePassenger test...");

    const testId = 50; // Change to an existing ID in your JSON

    const before = await getAllPassengers();
    console.log("Before removal:", before.map(p => p.id));

    const result = await removePassenger(testId);
    console.log("removePassenger returned:", result);

    const after = await getAllPassengers();
    console.log("After removal:", after.map(p => p.id));
}