import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function NewArrivals() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', { isNew: true }],
    queryFn: () => getProducts({ isNew: true }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { addItem } = useCart();
  
  const handleQuickAdd = (productId: number) => {
    addItem(productId, 1);
  };
  
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link href="/shop?new=true" className="text-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-lg overflow-hidden shadow-sm p-4">
                <Skeleton className="w-full h-64 rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link href="/shop?new=true" className="text-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <div className="text-center text-red-500 py-8">
            Error loading products. Please try again later.
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Link href="/shop?new=true" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-neutral-100 rounded-lg overflow-hidden shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="relative">
                <Link href={`/product/${product.slug}`}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-neutral-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </Button>
                <div className="absolute top-3 left-3">
                  <span className="bg-[#D9843A] text-white text-xs px-2 py-1 rounded-md">New</span>
                </div>
              </div>
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                </Link>
                <p className="text-neutral-700 text-sm mb-2">
                  {/* Get category name based on categoryId */}
                  {product.categoryId === 1 ? 'Living Room' :
                   product.categoryId === 2 ? 'Bedroom' :
                   product.categoryId === 3 ? 'Kitchen & Dining' :
                   product.categoryId === 4 ? 'Office' : 'Other'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    {formatCurrency(parseFloat(product.price))}
                  </span>
                  <Button 
                    size="icon" 
                    className="bg-primary hover:bg-primary/90 text-white p-2 rounded-md transition"
                    onClick={() => handleQuickAdd(product.id)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
