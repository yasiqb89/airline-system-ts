
type SeatType = 'aile' | 'middle' | 'window'

export interface SeatData {
    id: number
    seatNumber: string
    seatType: SeatType
    isReserved: boolean
    reservedBy: number | null
    flightId: number | null
}

export default class Seat {
    private _id: number
    private _seatNumber: string
    private _seatType: SeatType
    private _isReserved: boolean
    private _reservedBy: number | null
    private _flightId: number | null

    constructor(data: SeatData) {
        this._id = data.id;
        this._seatNumber = data.seatNumber;
        this._seatType = data.seatType;
        this._isReserved = data.isReserved;
        this._reservedBy = data.reservedBy;
        this._flightId = data.flightId;
    }

    get id(): number {
        return this._id;
    }

    get seatNumber(): string {
        return this._seatNumber;
    }

    get seatType(): SeatType {
        return this._seatType;
    }

    get flightId(): number | null {
        return this.flightId;
    }

    get isReserved(): boolean {
        return this._isReserved;
    }

    get reservedBy(): number | null {
        return this._reservedBy;
    }

    get info(): string {
        return `${this.seatNumber} | ${this.seatType} | ${this.isReserved} | ${this.reservedBy}`
    }

    reserve(passengerId: number): boolean {
        if (this.isReserved) return false;
        this._isReserved = true;
        this._reservedBy = passengerId;
        return true;
    }

    release(): boolean {
        if (!this.isReserved) return false;
        this._isReserved = false;
        this._reservedBy = null;
        return true;
    }

    isAvailable(): boolean {
        if (this.isReserved) {
            return false;
        }
        return true;
    }

    isWindow(): boolean {
        if (this._seatType === "window") {
            return true;
        }
        return false;
    }

    isMiddle(): boolean {
        if (this._seatType === "middle") {
            return true;
        }
        return false;
    }

    isAile(): boolean {
        if (this._seatType === "aile") {
            return true;
        }
        return false;
    }

    toJSON(): SeatData {
        return {
            id: this._id,
            seatNumber: this._seatNumber,
            seatType: this._seatType,
            isReserved: this._isReserved,
            reservedBy: this._reservedBy,
            flightId: this._flightId
        }

    }

    static fromPlain(obj: SeatData): Seat {
        return new Seat(obj);
    }

}

