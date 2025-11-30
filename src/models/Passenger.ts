export interface PassengerData {
    id: number;
    name: string;
    age: number;
    passportNumber: string;
}

export default class Passenger {
    private _id: number;
    private _name: string;
    private _age: number;
    private _passportNumber: string;

    constructor(data: PassengerData) {
        this._id = data.id;
        this._age = data.age;
        this._name = data.name;
        this._passportNumber = data.passportNumber;
    }

    get info(): string {
        return `${this._id} : ${this._name} - ${this._age} - ${this._passportNumber}`
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get age() {
        return this._age;
    }
    get passportNumber() {
        return this._passportNumber;
    }

    static fromPlain(obj: PassengerData): Passenger {
        const passengerData = { ...obj }
        return new Passenger(passengerData);
    }

    toJSON(): PassengerData {
        return {
            id: this._id,
            name: this._name,
            age: this._age,
            passportNumber: this._passportNumber
        };
    }
}