import { readFile, writeFile } from "fs/promises";
import { getPassengerById } from "./PassengerServices";
import { getAllFlights, getFlightById } from "./FlightServices";
import Flight, { FlightData } from "../models/Flight.js"

const filePath = new URL('../../data/flight.json', import.meta.url);

export async function bookSeat(flightId: number, passengerId: number) {
    const fId = Number(flightId);
    const pId = Number(passengerId);

    if (Number.isNaN(fId) || Number(pId)) return null;

    const passenger = await getPassengerById(pId);
    if (!passenger) return null;

    const flights = await getAllFlights();
    const flight = flights.find(f => f.id === fId);
    if (!flight) return null;

    if (flight.status === "departed" || flight.status === "cancelled") return null;

    if (!flight.hasAvailableSeats()) return null;

    if (!flight.bookSeat()) return null;

    const plainToSave: FlightData[] = flights.map(f => f.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), "utf-8");

    return flight;
}

