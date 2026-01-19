export class Gift {
    idGift: number = 0;
    name: string = '';
    description?: string;
    categoryId: number = 0;
    category: any = null; 
    quantity: number = 1;
    price: number = 0;
    image?: string;
    idDonor: number = 0;
    donor: any = null;
    isDrawn: boolean = false;
    userId?: number;
    user?: any;
    giftOrders: any[] = [];

    constructor(init?: Partial<Gift>) {
        Object.assign(this, init);
    }
}

export class GiftDto {
    name: string = '';
    description?: string;
    categoryId: number = 0;
    quantity: number = 1;
    price: number = 0;
    image?: string;
    idDonor: number = 0;

    constructor(init?: Partial<GiftDto>) {
        Object.assign(this, init);
    }
}

export class GiftDtoNew {
    idGift: number = 0;
    name: string = '';
    description: string = '';
    price: number = 0;
    numOfBuyers: number = 0;

    constructor(init?: Partial<GiftDtoNew>) {
        Object.assign(this, init);
    }
}

