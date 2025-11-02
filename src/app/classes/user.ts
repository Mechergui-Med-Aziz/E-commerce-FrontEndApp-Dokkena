export class User {
    public get phone(): number {
        return this._phone;
    }
    public set phone(value: number) {
        this._phone = value;
    }
    public get cin(): number {
        return this._cin;
    }
    public set cin(value: number) {
        this._cin = value;
    }
    public get adress(): string {
        return this._adress;
    }
    public set adress(value: string) {
        this._adress = value;
    }
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(value: string) {
        this._lastName = value;
    }
    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    constructor(
        private _id: number,
        private _firstName: string,
        private _lastName: string,
        private _cin: number,
        private _phone: number,
        private _email: string,
        private _password: string,
        private _adress: string
    ) {
}
}
