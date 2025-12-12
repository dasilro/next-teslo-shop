export const revalidate = 60;
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: { gender: string };
  searchParams: {
    page?: string;
  };
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;
  if (!Object.values(Gender).includes(gender as Gender)) {
    redirect("/");
  }
  const validGender = gender as Gender;
  const labels: Record<Gender, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages(
    {
      page,
    },
    validGender
  );
  if (products.length === 0) {
    redirect("/");
  }
  return (
    <>
      <Title title={`Artículos de ${labels[validGender]}`} className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
