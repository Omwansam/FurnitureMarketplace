import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySection() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                <Skeleton className="h-6 w-24" />
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
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="text-center text-red-500">
            Error loading categories. Please try again later.
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category: any) => (
            <Link key={category.id} href={`/shop/${category.slug}`} className="group">
              <div className="bg-neutral-100 rounded-lg overflow-hidden aspect-square mb-3 relative">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-center">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
