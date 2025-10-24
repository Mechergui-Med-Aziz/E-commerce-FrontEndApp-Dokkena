export class Product {
    public get originalPrice(): number {
        return this._originalPrice;
    }
    public set originalPrice(value: number) {
        this._originalPrice = value;
    }
    public get rating(): number {
        return this._rating;
    }
    public set rating(value: number) {
        this._rating = value;
    }
    public get isOnSale(): boolean {
        return this._isOnSale;
    }
    public set isOnSale(value: boolean) {
        this._isOnSale = value;
    }
    public get isFeatured(): boolean {
        return this._isFeatured;
    }
    public set isFeatured(value: boolean) {
        this._isFeatured = value;
    }
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    public get category(): string {
        return this._category;
    }
    public set category(value: string) {
        this._category = value;
    }
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get image(): string {
        return this._image;
    }
    public set image(value: string) {
        this._image = value;
    }

    constructor(

        private _id: number,
        private _name: string,
        private _price: number,
        private _image: string,
        private _category: string,
        private _description: string,
        private _isFeatured: boolean,
        private _isOnSale: boolean,
        private _rating: number,
        private _originalPrice?: number
    ) {}
      
}
