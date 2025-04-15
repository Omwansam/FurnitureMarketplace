import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/api";
import { useLocation } from "wouter";
import ProductFilter from "@/components/shop/ProductFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";

interface ShopProps {
  categorySlug?: string;
}

export default function Shop({ categorySlug }: ShopProps) {
  const [location] = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: 0,
    minPrice: 0,
    maxPrice: 5000,
    inStock: true,
    onSale: false,
    search: "",
    sortBy: "featured"
  });

  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const searchTerm = searchParams.get("search");
  const saleParam = searchParams.get("sale");
  const newParam = searchParams.get("new");

  // Set search term from URL
  useState(() => {
    if (searchTerm) {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }
    if (saleParam === "true") {
      setFilters(prev => ({ ...prev, onSale: true }));
    }
    if (newParam === "true") {
      setFilters(prev => ({ ...prev, sortBy: "newest" }));
    }
  });

  // Fetch categories 
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Find category ID from slug if provided
  useState(() => {
    if (categorySlug && categories) {
      const category = categories.find((cat: any) => cat.slug === categorySlug);
      if (category) {
        setFilters(prev => ({ ...prev, categoryId: category.id }));
      }
    }
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Get category name for title
  let categoryName = "All Products";
  if (filters.categoryId && categories) {
    const category = categories.find((cat: any) => cat.id === filters.categoryId);
    if (category) {
      categoryName = category.name;
    }
  } else if (searchTerm) {
    categoryName = `Search: ${searchTerm}`;
  } else if (saleParam === "true") {
    categoryName = "Sale Items";
  } else if (newParam === "true") {
    categoryName = "New Arrivals";
  }

  return (
    <div className="bg-neutral-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Mobile filter toggle */}
          <div className="w-full md:hidden mb-4">
            <Button 
              onClick={toggleFilter} 
              variant="outline" 
              className="w-full flex items-center justify-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Sidebar filters - desktop always visible, mobile toggleable */}
          <div className={`w-full md:w-1/4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            {categoriesLoading ? (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <ProductFilter 
                categories={categories} 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            )}
          </div>

          {/* Main product grid */}
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{categoryName}</h1>
              {searchTerm && (
                <p className="mt-2 text-neutral-500">
                  Showing results for "{searchTerm}"
                </p>
              )}
            </div>

            <ProductGrid 
              categoryId={filters.categoryId}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              inStock={filters.inStock}
              onSale={filters.onSale}
              search={filters.search}
              sortBy={filters.sortBy}
              isNew={newParam === "true"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
