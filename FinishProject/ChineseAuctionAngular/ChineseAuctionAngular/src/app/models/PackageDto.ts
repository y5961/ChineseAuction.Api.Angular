export class Package {
    idPackage: number = 0;
    name: string = '';
    price: number = 0;
    amount_Regular: number = 0;
    amount_Premium: number = 0;
    description?: string;

    constructor(init?: Partial<Package>) {
        Object.assign(this, init);
    }
}

export class PackageDto {
    name: string = '';
    description: string = '';
    price: number = 0;
    amount_Regular: number = 0;
    amount_Premium: number = 0;

    constructor(init?: Partial<PackageDto>) {
        Object.assign(this, init);
    }
}