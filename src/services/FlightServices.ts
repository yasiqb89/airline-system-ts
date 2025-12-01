import { readFile, writeFile } from "fs/promises";
import Flight, { FlightData } from "../models/Flight.js"

const filePath = new URL('../../data/flight.json', import.meta.url);

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


if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Running Flight test...");

    const result = await getAllFlights();
    console.log("Loaded flights:", result.length);

    if (result[0]) {
        console.log("First flight info:", result[0].info);
    } else {
        console.log("No flights found.");
    }
}