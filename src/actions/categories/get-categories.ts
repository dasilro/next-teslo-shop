"use server";

import { ProductCategory } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export const getCategories = async (): Promise<ProductCategory[]> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};
