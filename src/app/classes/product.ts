import { Category } from "./category";

export class Product {
    public get image2(): string {
        return this._image2;
    }
    public set image2(value: string) {
        this._image2 = value;
    }
    public get image3(): string {
        return this._image3;
    }
    public set image3(value: string) {
        this._image3 = value;
    }
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
    public get category(): Category {
        return this._category;
    }
    public set category(value: Category) {
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
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get image(): string {
        return this._image;
    }
    public set image(value: string) {
        this._image = value;
    }

    constructor(

        private _id: string,
        private _name: string,
        private _price: number,
        private _image: string,
        private _image2: string,
        private _image3: string,
        private _category: Category,
        private _description: string,
        private _isFeatured: boolean,
        private _isOnSale: boolean,
        private _rating: number,
        private _originalPrice?: number
    ) {}
      
}
