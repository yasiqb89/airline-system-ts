import { info } from "console"

type SeatType = 'aile' | 'middle' | 'window'

export interface SeatData {
    id: number
    seatNumber: string
    seatType: SeatType
    isReserved: boolean
    reservedBy: number | null
}

export class Seat {
    private _id: number
    private _seatNumber: string
    private _seatType: SeatType
    private _isReserved: boolean
    private _reservedBy: number | null

    constructor(data: SeatData) {
        this._id = data.id;
        this._seatNumber = data.seatNumber;
        this._seatType = data.seatType;
        this._isReserved = data.isReserved;
        this._reservedBy = data.reservedBy;
    }

    get seatId(): number {
        return this.seatId;
    }

    get seatNumber(): string {
        return this.seatNumber;
    }

    get seatType(): SeatType {
        return this.seatType;
    }

    get isReserved(): boolean {
        return this.isReserved;
    }

    get reservedBy(): number | null {
        return this.reservedBy;
    }

    get info(): string {
        return `${this.seatNumber} | ${this.seatType} | ${this.isReserved} | ${this.reservedBy}`
    }

    reserve(): boolean {
        if (this.isReserved) return false;
        this._isReserved = true;
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
        }

    }

}

