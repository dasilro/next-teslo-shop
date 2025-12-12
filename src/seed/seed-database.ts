import { initialData, SeedProduct } from "./seed";
import { prisma } from "../lib/prisma";
import { countries } from "./seed-countries";

const main = async () => {
    if (process.env.NODE_ENV === "production") return;

    // 1. Limpiar la base de datos    
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();    

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();


    // 2. Insertar datos iniciales

    // 2.1 Insertar categorías
    const { categories, products, users } = initialData;
    const categoriesData = categories.map(category => ({ name: category }));
    await prisma.category.createMany({ data: categoriesData });
    
    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>); //<string = shirt, string = categoryID>

    // 2.2 Insertar productos
    products.forEach(async (product) => {
        const { images, type, ...rest } = product as SeedProduct;
        // Product
        const dbProduct = await prisma.product.create({
            data: { ...rest, categoryId: categoriesMap[product.type.toLowerCase()]! }
        });

        // Image
        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }));
        await prisma.productImage.createMany({ data: imagesData });
    });

    // 2.3 Insertar usuarios
    await prisma.user.createMany({ data: users });

    // 2.4 Insertar paises
    await prisma.country.createMany({ data: countries });


    console.log("Seed ejecutado correctamente");
}

main();
