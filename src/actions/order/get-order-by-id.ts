"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Debe estar autenticado" };
  }

  try {
    const orderdb = await prisma.order.findUnique({
      where: {
        id,
        userId: session.user.role === "user" ? session?.user.id : undefined,
      },
      include: {
        OrderAddress: {
          include: {
            country: true,
          },
        },
        OrderItem: {
          include: {
            Product: {
              select: {
                title: true,
                slug: true,
                productImage: {
                  take: 1,
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderdb) {
      throw new Error(`Orden con id ${id} no encontrada para el usuario`);
    }
    const order = {
      id: orderdb.id,
      subTotal: orderdb.subTotal,
      tax: orderdb.tax,
      total: orderdb.total,
      itemsInOrder: orderdb.itemsInOrder,
      isPaid: orderdb.isPaid,
      paidAt: orderdb.paidAt,
      OrderAddress: orderdb.OrderAddress
        ? {
            firstName: orderdb.OrderAddress.firstName,
            lastName: orderdb.OrderAddress.lastName,
            address: orderdb.OrderAddress.address,
            address2: orderdb.OrderAddress.address2 || undefined,
            postalCode: orderdb.OrderAddress.postalCode,
            city: orderdb.OrderAddress.city,
            country: orderdb.OrderAddress.country.name,
            phone: orderdb.OrderAddress.phone,
          }
        : undefined,
      OrderItem: orderdb.OrderItem.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        productId: item.productId,
        orderId: item.orderId,
        Product: {
          title: item.Product.title,
          slug: item.Product.slug,
          productImage: item.Product.productImage.map((img) => ({
            url: img.url,
          })),
        },
      })),
    };
    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Ordern no existe" };
  }
};
