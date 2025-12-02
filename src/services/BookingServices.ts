import { readFile, writeFile } from "fs/promises";
import { getPassengerById } from "./PassengerServices";
import { getAllFlights, getFlightById, updateFlight } from "./FlightServices";
import Flight, { FlightData } from "../models/Flight.js"

const filePath = new URL('../../data/bookings.json', import.meta.url);

interface BookingData {
    id: number;
    flightId: number;
    passengerId: number;
    bookedAt: string;
}

export async function getAllBookings(): Promise<BookingData[]> {
    try {
        const data = await readFile(filePath, 'utf-8');
        const rawData: BookingData[] = JSON.parse(data);
        return rawData;
    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export async function saveBooking(partialBookingData: Omit<BookingData, "id">): Promise<BookingData | null> {
    const bookings = await getAllBookings();
    const maxId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0;
    const nextId = maxId + 1;

    const booking: BookingData = {
        id: nextId,
        ...partialBookingData,
    };

    bookings.push(booking);
    const plainToSave = JSON.stringify(bookings, null, 2);
    await writeFile(filePath, plainToSave, "utf-8");

    return booking;
}



export async function bookSeat(flightId: number, passengerId: number) {
    const fId = Number(flightId);
    const pId = Number(passengerId);

    if (!Number.isFinite(fId) || !Number.isFinite(pId)) return null;

    const passenger = await getPassengerById(pId);
    if (!passenger) return null;

    const flights = await getAllFlights();
    const flight = flights.find(f => f.id === fId);
    if (!flight) return null;

    if (flight.status === "departed" || flight.status === "cancelled") return null;

    if (!flight.hasAvailableSeats()) return null;

    const booked = flight.bookSeat();
    if (!booked) return null;

    const updated = await updateFlight(fId, { bookedSeats: flight.bookedSeats });

    const booking = await saveBooking({
        flightId: fId,
        passengerId: pId,
        bookedAt: new Date().toISOString(),
    });

    return booking;
}



