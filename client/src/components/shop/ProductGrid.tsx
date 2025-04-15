import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
  sortBy?: string;
  isNew?: boolean;
}

export default function ProductGrid({
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  search,
  sortBy = "featured",
  isNew
}: ProductGridProps) {
  // Fetch products with filters
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', { categoryId, search, isNew }],
    queryFn: () => getProducts({ categoryId, search, isNew }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm p-4">
            <Skeleton className="w-full h-64 rounded-md mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  // Apply client-side filters
  let filteredProducts = [...products];

  // Filter by price
  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = parseFloat(product.discountPrice || product.price);
      const aboveMinimum = minPrice !== undefined ? price >= minPrice : true;
      const belowMaximum = maxPrice !== undefined ? price <= maxPrice : true;
      return aboveMinimum && belowMaximum;
    });
  }

  // Filter by stock status
  if (inStock) {
    filteredProducts = filteredProducts.filter((product) => product.stock > 0);
  }

  // Filter by sale status
  if (onSale) {
    filteredProducts = filteredProducts.filter((product) => product.discountPrice);
  }

  // Sort products
  switch (sortBy) {
    case "price-low-high":
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(a.discountPrice || a.price);
        const priceB = parseFloat(b.discountPrice || b.price);
        return priceA - priceB;
      });
      break;
    case "price-high-low":
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(a.discountPrice || a.price);
        const priceB = parseFloat(b.discountPrice || b.price);
        return priceB - priceA;
      });
      break;
    case "newest":
      filteredProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "best-selling":
      // In a real app this would use sales data
      break;
    case "featured":
    default:
      filteredProducts = filteredProducts.filter(product => product.featured).concat(
        filteredProducts.filter(product => !product.featured)
      );
      break;
  }

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-neutral-500">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
