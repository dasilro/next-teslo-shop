"use server";

import { prisma } from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: slug },
      include: {
        productImage: true,
      },
    });

    if (!product) {
      return null;
    }

    return { ...product, images: product.productImage.map((img) => img.url) };
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el producto por slug");
  }
};
