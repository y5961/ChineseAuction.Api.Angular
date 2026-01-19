export enum OrderStatus {
    Draft = 0,
    Completed = 1
}

export class OrderItemDto {
    name: string = '';
    description?: string;
    category: string = '';
    amount: number = 1;
    price: number = 0;
    image?: string;

    constructor(init?: Partial<OrderItemDto>) {
        Object.assign(this, init);
    }
}

export class OrderDto {
    status: OrderStatus = OrderStatus.Draft;
    userId: number = 0;
    dateTime: Date = new Date();
    items: OrderItemDto[] = [];
    totalAmount: number = 0;
    totalPrice: number = 0;
    ordersGift: OrderItemDto[] = [];

    constructor(init?: Partial<OrderDto>) {
        Object.assign(this, init);
        if (init?.items) {
            this.items = init.items.map(i => new OrderItemDto(i));
        }
        if (init?.ordersGift) {
            this.ordersGift = init.ordersGift.map(i => new OrderItemDto(i));
        }
    }
}

export class AddGiftRequest {
    userId: number = 0;
    giftId: number = 0;
    amount: number = 1;

    constructor(init?: Partial<AddGiftRequest>) {
        Object.assign(this, init);
    }
}