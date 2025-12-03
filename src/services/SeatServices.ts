import { readFile, writeFile } from "fs/promises";
import Seat, { SeatData } from "../models/Seat";
import { pid } from "process";
import { getPassengerById } from "./PassengerServices.js";
import { getFlightById } from "./FlightServices.js";

const filePath = new URL('../../data/seats.json', import.meta.url);

export async function getAllSeats(): Promise<Seat[]> {
    try {
        const data = await readFile(filePath, "utf-8");
        const raw: SeatData[] = JSON.parse(data);
        return raw.map(obj => Seat.fromPlain(obj));

    } catch (error: any) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}


export async function getSeatById(seatId: number): Promise<Seat | null> {
    const id = Number(seatId);
    if (!Number.isFinite(id)) return null;

    const seats = await getAllSeats();
    const seat = seats.find(s => s.id === id);

    return seat ?? null;
}


export async function reserveSeat(flightId: number, seatNumber: string, passengerId: number): Promise<Seat | null> {
    const pId = Number(passengerId);
    const fId = Number(flightId);

    if (!Number.isFinite(pId) || !Number.isFinite(fId)) return null;

    const sNumber = (seatNumber).trim();
    if (!sNumber) return null;

    const passenger = await getPassengerById(pid);
    if (!passenger) return null;

    const flight = await getFlightById(fId);
    if (!flight) return null;

    if (flight.status === "departed" || flight.status === "cancelled") return null;

    const seats = await getAllSeats();
    const seat = seats.find(
        s => (s.seatNumber === sNumber && s.flightId === fId)
    )

    if (!seat || seat.isReserved) return null;
    if (!seat.reserve(pId)) return null;

    const plainToSave = seats.map(s => s.toJSON());
    await writeFile(filePath, JSON.stringify(plainToSave, null, 2), 'utf-8');

    return seat;
}


if (import.meta.url === `file://${process.argv[1]}`) {
    console.log(await getSeatById(1));
}