import { readFile, writeFile } from "fs/promises";
import Flight, { FlightData } from "../models/Flight.js"


const filePath = new URL('../../data/flights.json', import.meta.url);

export async function getAllFlights(): Promise<Flight[]> {
    try {
        const data = await readFile(filePath, 'utf-8');
        const rawData: FlightData[] = JSON.parse(data);
        return rawData.map(obj => Flight.fromPlain(obj));
    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function getFlightById(flightId: number): Promise<Flight | null> {
    const id = Number(flightId);
    if (Number.isNaN(id)) return null;

    const flights = await getAllFlights();
    const flight = flights.find(f => f.id === id);
    if (!flight) return null;

    return flight;

}


export async function addFlight(data: FlightData): Promise<Flight> {
    const flights = await getAllFlights();
    const maxId = flights.length > 0 ? Math.max(...flights.map(f => f.id)) : 0;
    const nextId = maxId + 1;

    const flightInfo = {
        id: nextId,
        flightNumber: data.flightNumber,
        origin: data.origin,
        destination: data.destination,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        capacity: data.capacity,
        bookedSeats: data.bookedSeats,
        status: data.status
    }

    const newFlight = new Flight(flightInfo);
    flights.push(newFlight);

    const plainToSave = flights.map(f => f.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), 'utf-8');
    return newFlight;

}


export async function updateFlight(flightId: number, updates: Partial<FlightData>): Promise<Flight | null> {
    const id = Number(flightId);
    if (!Number.isFinite(id)) return null;

    const flights = await getAllFlights();
    const index = flights.findIndex(f => f.id === id);
    if (index === -1) {
        return null; // no such flight
    }

    const current = flights[index];
    const currentPlain = current.toJSON();

    // never allow changing the id from outside
    const { id: _ignoreId, ...restUpdates } = updates;

    // merge existing plain data + updates
    const merged: FlightData = {
        ...currentPlain,
        ...restUpdates,
    };

    const updatedFlight = new Flight(merged);
    flights[index] = updatedFlight;

    const plainToSave: FlightData[] = flights.map(f => f.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), "utf-8");

    return updatedFlight;


}


export async function removeFlight(flightId: number): Promise<boolean | null> {
    const id = Number(flightId);
    if (!Number.isNaN) return null;

    const flights = await getAllFlights();
    const filtered = flights.filter(f => f.id !== id);
    if (filtered.length === flights.length) return false;

    const plainToSave: FlightData[] = filtered.map(f => f.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), 'utf-8');

    return true;
}



if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Running Flight test...");

    const result = await getAllFlights();
    // console.log("Loaded flights:", result.length);

    // if (result[0]) {
    //     console.log("First flight info:", result[0].info);
    // } else {
    //     console.log("No flights found.");
    // }
}