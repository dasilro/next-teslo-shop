import { Address } from "./address.interface";

export interface Order {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt: Date | null;    
    OrderItem: OrderItem[]
    OrderAddress?: Address
};

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size: string;
    productId: string;
    orderId: string;
    Product: {
        title: string;
        slug: string;
        productImage: {
            url: string;
        }[]
    }
};