
type FlightStatus = "scheduled" | "boarding" | "departed" | "cancelled";

interface FlightData {
    id: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    capacity: number;
    bookedSeats: number;
    status: FlightStatus
}

class Flight {
    private _id: number;
    private _flightNumber: string;
    private _origin: string;
    private _destination: string;
    private _departureTime: Date;
    private _arrivalTime: Date;
    private _capacity: number;
    private _bookedSeats: number;
    private _status: FlightStatus;

    constructor(data: FlightData) {
        this._id = data.id;
        this._flightNumber = data.flightNumber;
        this._origin = data.origin;
        this._destination = data.destination;
        this._departureTime = data.departureTime;
        this._arrivalTime = data.arrivalTime;
        this._capacity = data.capacity;
        this._bookedSeats = data.bookedSeats;
        this._status = data.status;
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get info(): string {
        return `${this._flightNumber} | ${this._origin} → ${this._destination} | ` +
            `Departs: ${this._departureTime.toISOString()} | ` +
            `Seats: ${this._bookedSeats}/${this._capacity} | Status: ${this._status}`;
    }

    get status(): FlightStatus {
        return this._status;
    }

    get isFull(): boolean {
        return this._bookedSeats >= this._capacity;
    }

    get availableSeats(): number {
        return Math.max(this._capacity - this._bookedSeats, 0);
    }

    // Methods

    bookSeat(): boolean {
        if (this._status !== "scheduled" && this._status !== "boarding") {
            return false; // cannot book on departed/cancelled flight
        }
        if (this.isFull) {
            return false;
        }
        this._bookedSeats += 1;
        return true;
    }

    hasAvailableSeats(): boolean {
        return this._bookedSeats < this._capacity;
    }

    cancel(): void {
        if (this._status === "departed") return; // too late to cancel
        this._status = "cancelled";
    }

    delay(minutes: number): void {
        if (minutes <= 0) return;

        const shiftMs = minutes * 60 * 1000;

        this._departureTime = new Date(this._departureTime.getTime() + shiftMs);
        this._arrivalTime = new Date(this._arrivalTime.getTime() + shiftMs);
    }

    isDepartingSoon(): boolean {
        const now = new Date().getTime();
        const depTime = this._departureTime.getTime();

        if (depTime <= now) return false; // already departed

        const diff = depTime - now;
        const oneHourMs = 60 * 60 * 1000;

        return diff <= oneHourMs;
    }


    boardPassenger(): boolean {
        if ((this._status !== "scheduled" && this._status !== "boarding") || !this.hasAvailableSeats()) {
            return false;
        }
        this._bookedSeats += 1;
        return true;
    }

    setStatus(newStatus: FlightStatus): void {
        if (this._status === "departed" || this._status === "cancelled") {
            return;
        }
        this._status = newStatus;
    }

    static fromPlain(obj: {
        id: number;
        flightNumber: string;
        origin: string;
        destination: string;
        departureTime: string;
        arrivalTime: string;
        capacity: number;
        bookedSeats: number;
        status: FlightStatus;
    }): Flight {
        const flightData = { ...obj, departureTime: new Date(obj.departureTime), arrivalTime: new Date(obj.arrivalTime) }
        return new Flight(flightData);
    }
}



// Test code (only runs when this file is executed directly)
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("\n=== Flight Test Start ===");

    const testFlight = new Flight({
        id: 1,
        flightNumber: "EK202",
        origin: "DXB",
        destination: "LHR",
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        arrivalTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        capacity: 180,
        bookedSeats: 0,
        status: "scheduled",
    });

    console.log("INFO:", testFlight.info);
    console.log("Has available seats:", testFlight.hasAvailableSeats());
    console.log("Is departing soon:", testFlight.isDepartingSoon());

    testFlight.delay(30);
    console.log("After delay (30min):", testFlight.info);

    testFlight.cancel();
    console.log("After cancellation:", testFlight.info);

    console.log("=== Flight Test End ===\n");
}