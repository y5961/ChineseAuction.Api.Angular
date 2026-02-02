import { Package } from './PackageDTO';
import { OrderDTO } from './OrderDTO';

export class OrdersPackage {
  idPackageOrder: number = 0;
  orderId: number = 0;
  order?: OrderDTO;       // קשר לישות ההזמנה
  idPackage: number = 0;
  package?: Package;      // קשר לישות החבילה
  quantity: number = 1;
  priceAtPurchase: number = 0;

  constructor(init?: Partial<OrdersPackage>) {
    Object.assign(this, init);
  }
}