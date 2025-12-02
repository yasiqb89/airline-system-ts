import { readFile, writeFile } from "fs/promises";
import { getPassengerById } from "./PassengerServices.js";
import { getAllFlights, getFlightById, updateFlight } from "./FlightServices.js";
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


async function getBookingById(bookingId: number): Promise<BookingData | null> {
    const id = Number(bookingId);
    if (!Number.isFinite(id)) return null;

    const bookings = await getAllBookings();
    const booking = bookings.find(b => b.id === id);

    return booking ?? null;
}


async function getBookingByFlightId(flightId: number): Promise<BookingData[] | null> {
    const id = Number(flightId);
    if (!Number.isFinite(id)) return null;

    const bookings = await getAllBookings();
    const booking = bookings.filter(b => b.flightId === id); // Can have multiple bookings for the same flight

    return booking.length > 0 ? booking : null;
}


async function getBookingByPassengerId(passengerId: number): Promise<BookingData[] | null> {
    const id = Number(passengerId);
    if (!Number.isFinite(id)) return null;

    const bookings = await getAllBookings();
    const booking = bookings.filter(b => b.passengerId === id); // Can have multiple bookings for the same passenger

    return booking.length > 0 ? booking : null;
}

export async function cancelBooking(bookingId: number) {
    const id = Number(bookingId);
    if (!Number.isFinite(id)) return false;

    const bookings = await getAllBookings();
    if (bookings.length === 0) return false;

    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return false;

    const [booking] = bookings.splice(index, 1); // Booking reference for cancelled 

    await writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf-8');

    const flight = await getFlightById(booking.flightId);
    if (flight) {
        const newBookedSeats = Math.max(flight.bookedSeats - 1, 0);
        await updateFlight(booking.flightId, { bookedSeats: newBookedSeats });
    }

    return true;
}


if (import.meta.url === `file://${process.argv[1]}`) {
    // const booking = await bookSeat(1, 3);
    // const booking2 = await bookSeat(1, 4);
    // console.log("Created booking:", booking);
    // console.log("Created booking:", booking2);

    const bookings = await getBookingByFlightId(1);
    console.log("Bookings for flight 1:", bookings);

    const booking3 = await getBookingById(1);
    console.log("Booking 3:", booking3);

    const booking4 = await getBookingById(2);
    console.log("Booking 4:", booking4);

    const booking5 = await getBookingById(3);
    console.log("Booking 5:", booking5);

    const booking6 = await getBookingByPassengerId(3);
    console.log("Booking 6:", booking6);

}