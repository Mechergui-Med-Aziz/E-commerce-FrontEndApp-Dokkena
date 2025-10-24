export class Category {
    public get productCount(): number {
        return this._productCount;
    }
    public set productCount(value: number) {
        this._productCount = value;
    }
    public get image(): string {
        return this._image;
    }
    public set image(value: string) {
        this._image = value;
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

    constructor(
        private _id: number,
        private _name: string,
        private _image: string,
        private _productCount: number
      ){}
}
