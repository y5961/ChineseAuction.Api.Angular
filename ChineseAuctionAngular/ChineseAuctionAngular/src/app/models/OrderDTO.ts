// 1. ה-Enum חייב להופיע ראשון ומחוץ ל-Class
export enum OrderStatus {
  Draft = 0,
  Completed = 1
}

// 2. הגדרת מתנה בתוך הזמנה
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

// 3. הגדרת חבילה בתוך הזמנה (השדה שגרם לשגיאה בקומפוננטה)
export class OrdersPackageDTO {
  idPackage: number = 0;
  quantity: number = 0;
  name: string = '';
  price: number = 0;

  constructor(init?: Partial<OrdersPackageDTO>) {
    Object.assign(this, init);
  }
}

// 4. אובייקט ההזמנה המלא
export class OrderDTO {
  totalAmount: number = 0;
  totalPrice: number = 0;
  idUser: number = 0;
  amount: number = 1;
  orderDate: Date = new Date();
  status: OrderStatus = OrderStatus.Draft;
  
  // הוספת המערכים
  ordersPackages: OrdersPackageDTO[] = []; 
  ordersGifts: OrdersGiftDTO[] = []; 

  constructor(init?: Partial<OrderDTO>) {
    Object.assign(this, init);
    if (init?.orderDate) {
      this.orderDate = new Date(init.orderDate);
    }
    // אתחול בטוח של המערכים
    this.ordersPackages = init?.ordersPackages ? init.ordersPackages.map(p => new OrdersPackageDTO(p)) : [];
    this.ordersGifts = init?.ordersGifts ? init.ordersGifts.map(g => new OrdersGiftDTO(g)) : [];
  }
}