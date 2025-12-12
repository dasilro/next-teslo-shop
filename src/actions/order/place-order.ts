'use server';

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";





export interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async ( productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;

    // Verificar usuario
    if (!userId){
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    }    

    //Obtener información de los productos
    //Recuerden que podemos comprar 2 o más productos con el mismo id.
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }});
    
    
    // Calcular cantidades
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity ,0);
    
    // Calcular los totales tax, subtotal y total
    const {subTotal, tax, total} = productIds.reduce((totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);
        if (!product) throw new Error(`${item.productId} no existe - 500`);
        const subTotal = product.price * productQuantity;        
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;
        return totals;
    }, { subTotal: 0, tax: 0, total: 0 });

    // Crear la transacción de bbdd.
    try {        
        const prismaTx = await prisma.$transaction(async (tx) => {
        // 1.-Actualizar el stock de los productos.
        const updatedProductsPromises = products.map(( product ) => {
            // Acumular valores
            const productQuantity = productIds.filter(p => p.productId === product.id)
                                              .reduce((acc, item) => item.quantity + acc, 0);
            if (productQuantity === 0){
                throw new Error(`${product.id} no tiene cantidad definida`);
            }
            return tx.product.update({
                where: { id: product.id },
                data: {
                    inStock: {
                        decrement: productQuantity
                    }
                }
            });            
        });
        const updatedProducts = await Promise.all(updatedProductsPromises);

        // Verificar valores negativos en existencias -> no hay stock
        updatedProducts.forEach(product => {
            if (product.inStock < 0) {
                throw new Error(`${product.title} no tiene inventario suficiente`);
            }
        })
        
        // 2.-Crear la cabecera de la orden y el detalle.
        const order = await tx.order.create({
            data: {
                userId: userId,
                itemsInOrder: itemsInOrder,
                subTotal: subTotal,
                tax: tax,
                total: total,
                OrderItem: {
                    createMany: {
                        data: productIds.map((p) => ({
                            quantity: p.quantity,
                            size: p.size,
                            productId: p.productId,
                            price: products.find(product => product.id === p.productId)?.price ?? 0
                        }))
                    }
                }
            }
        });
        // Validar si price es 0, lanzar excepción.       

        // 3.-Crear la dirección.
        const orderAddress = await tx.orderAddress.create({
             data: {
                address: address.address,
                address2: address.address2,
                city: address.city,
                firstName: address.firstName,
                lastName: address.lastName,
                phone: address.phone,
                postalCode: address.postalCode,
                countryId: address.country,
                orderId: order.id                
             }
        });
        
        return {
            order,
            orderAddress,
            updatedProducts
        }
        });
        return { ok: true, order: prismaTx.order.id, prismaTx};
    } catch (error: any) {
        return { ok: false, message: error.message};
    }    
}