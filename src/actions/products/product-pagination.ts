'use server';
import { Gender } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

interface PaginationOptions {
    page?: number;
    take?: number;
}
export const getPaginatedProductsWithImages = async ({page = 1, take = 12}: PaginationOptions, gender?: Gender) => {
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(take) || take < 1) take = 12;
    try{        
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                take, 
                skip: (page - 1) * take,
                where: gender ? { gender } : {},
                include: { 
                    productImage: {
                        take: 2,
                        select: {
                            url: true
                        }
                }}
               }),              
            prisma.product.count({where: gender ? { gender } : {}})
        ]);
              
       const totalPages = Math.ceil(totalCount / take);

       return {
        currentPage: page,
        totalPages: totalPages,
        products: products.map(product => ({...product, images: product.productImage.map(img => img.url)})),
       }
    }   
    catch(error){
        console.log(error);
        throw new Error('Error al obtener los productos');
    }
    
}