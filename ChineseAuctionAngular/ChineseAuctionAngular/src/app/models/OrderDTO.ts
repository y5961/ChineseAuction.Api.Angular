// הגדרת enum למצב ההזמנה
export enum OrderStatus {
  Draft = 0,
  Completed = 1
}

// OrdersGiftDTO - פרטי מתנה בתוך הזמנה
export class OrdersGiftDTO {
  category: string = '';
  name: string = '';
  amount: number = 1;
  price: number = 0;
  description: string = '';
  image?: string;

  constructor(init?: Partial<OrdersGiftDTO>) {
    Object.assign(this, init);
  }
}

// OrderDTO - אובייקט ההזמנה המלא כפי שמועבר ללקוח
export class OrderDTO {
  totalAmount: number = 0;
  totalPrice: number = 0;
  idUser: number = 0;
  amount: number = 1;
  orderDate: Date = new Date();
  status: OrderStatus = OrderStatus.Draft;
  ordersGifts: OrdersGiftDTO[] = [];

  constructor(init?: Partial<OrderDTO>) {
    Object.assign(this, init);
    if (init?.orderDate) {
      this.orderDate = new Date(init.orderDate);
    }
  }
}