import { readFile, writeFile } from "fs/promises";
import Flight, { FlightData } from "../models/Flight.js"

const filePath = new URL('../../ data / flight.json', import.meta.url);

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


