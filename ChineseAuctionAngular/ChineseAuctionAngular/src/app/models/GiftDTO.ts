import { GiftCategoryDTO } from './CategoryDTO';
import { DonorDTO } from './DonorDTO';
import { UserDTO } from './UserDTO';
import { OrdersGiftDTO } from './OrderDTO';

export class GiftDTO {
  name: string = '';
  description?: string = '';
  categoryId: number = 0;
  quantity: number = 0;
  image?: string = '';
  idDonor: number = 0;
  price: number = 0;

  constructor(init?: Partial<GiftDTO>) {
    Object.assign(this, init);
  }
}

export class GiftNewDTO {
  idGift: number = 0;
  name: string = '';
  description: string = '';
  price: number = 0;
  numOfBuyers: number = 0;

  constructor(init?: Partial<GiftNewDTO>) {
    Object.assign(this, init);
  }
}

export class Gift {
  idGift: number = 0;
  name: string = '';
  description?: string = '';
  categoryId: number = 0;
  category?: GiftCategoryDTO; // הוחלף מ-any
  amount: number = 1;
  image?: string = '';
  idDonor: number = 0;
  donor?: DonorDTO; // הוחלף מ-any
  isDrawn: boolean = false;
  idUser?: number;
  user?: UserDTO; // הוחלף מ-any
  price: number = 0;
  ordersGifts: [] = []; // הוחלף מ-any

  constructor(init?: Partial<Gift>) {
    Object.assign(this, init);
  }
}