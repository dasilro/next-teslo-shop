"use server";

import { Gender, Product, Size } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce
    .string()
    .transform((val) => val.split(",").map((size) => size.trim())),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);
  if (!productParsed.success) {
    console.error("Validation errors:", productParsed.error);
    return { ok: false, errors: productParsed.error.flatten() };
  }
  console.log(productParsed.data);
  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();
  const { id, ...rest } = product;

  try {
    const prismaTx = prisma.$transaction(async (tx) => {
      let product: Product;
      const tagArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      if (id) {
        // Update
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagArray,
            },
          },
        });
      } else {
        // Insert
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagArray,
            },
          },
        });
      }

      // Proceso de carga y guardado de imagenes.
      // Recorrer imágenes y guardarlas.
      if (formData.getAll("images")) {
        console.log(formData.getAll("images"));
        const images = await uploadImages(formData.getAll("images") as File[]);
        if (!images) {
          throw new Error("No se pudo cargar las imágenes, rollback.");
        }
        await prisma.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productId: product.id,
          })),
        });
      }

      return { product };
    });

    //revalidate Path
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return { ok: true, product: (await prismaTx).product };
  } catch (error) {
    console.error("Error in createUpdateProduct:", error);
    return {
      ok: false,
      message: "Revisar los logs, no se puedo actualizar/crear",
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image: File) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
