import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];    
    getTotalItems: () => number;
    getSummaryInformation: () =>  {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    clearCart: () => void;
};

export const useCartStore = create<State>()(    
    persist(        
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const { cart } = get();                
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getSummaryInformation: () => {
                const { cart, getTotalItems } = get();
                const subTotal = cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
                const tax = subTotal * 0.15;
                const total = subTotal + tax;
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
                return {                    
                    subTotal,
                    tax,
                    total,
                    itemsInCart,
                };
            },
            addProductToCart: (product: CartProduct) =>{
                const { cart } = get();
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                );
    
                // Insertar el producto si no existe
                if (!productInCart) {
                    set({
                        cart: [...cart, product],
                    });
                    return;
                } 
    
                // Actualizar la cantidad si el producto ya existe
                const updatedCartProducts = cart.map((item) =>{
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity,
                        };
                    }
                    return item;
                });
    
                set({ cart: updatedCartProducts });
                
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();                                
                const updatedCart = cart.map(p => {
                    if (p.id === product.id && p.size === product.size) {
                        p.quantity = quantity;
                    }
                    return p;
                });                
                set({ cart: updatedCart });
            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get();                                
                const updatedCart = cart.filter(p => !(p.id === product.id && p.size === product.size));                                                        
                set({ cart: updatedCart });
            },
            clearCart: () => {
                set({cart:[]})
            }
        }),
        {
            name: 'shopping-cart', // unique name            
        }
    )
)