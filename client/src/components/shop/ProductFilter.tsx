import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ProductFilterProps {
  categories: any[];
  filters: {
    categoryId: number;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    onSale: boolean;
    search: string;
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function ProductFilter({ 
  categories, 
  filters, 
  onFilterChange 
}: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  
  // Handle category change
  const handleCategoryChange = (id: number) => {
    onFilterChange({ categoryId: id });
  };
  
  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  // Apply price filter when slider stops
  const handlePriceChangeCommitted = () => {
    onFilterChange({ 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1] 
    });
  };
  
  // Handle stock filter change
  const handleStockChange = (checked: boolean) => {
    onFilterChange({ inStock: checked });
  };
  
  // Handle sale filter change
  const handleSaleChange = (checked: boolean) => {
    onFilterChange({ onSale: checked });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    onFilterChange({ sortBy: value });
  };
  
  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      categoryId: 0,
      minPrice: 0,
      maxPrice: 5000,
      inStock: true,
      onSale: false,
      sortBy: "featured"
    });
    setPriceRange([0, 5000]);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox 
                id="all-categories" 
                checked={filters.categoryId === 0}
                onCheckedChange={() => handleCategoryChange(0)}
              />
              <Label 
                htmlFor="all-categories" 
                className="ml-2 text-sm font-medium cursor-pointer"
              >
                All Categories
              </Label>
            </div>
            
            {categories?.map(category => (
              <div key={category.id} className="flex items-center">
                <Checkbox 
                  id={`category-${category.id}`} 
                  checked={filters.categoryId === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label 
                  htmlFor={`category-${category.id}`} 
                  className="ml-2 text-sm font-medium cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider 
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeCommitted}
            className="my-6"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox 
                id="in-stock" 
                checked={filters.inStock}
                onCheckedChange={(checked) => handleStockChange(checked as boolean)}
              />
              <Label 
                htmlFor="in-stock" 
                className="ml-2 text-sm font-medium cursor-pointer"
              >
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="on-sale" 
                checked={filters.onSale}
                onCheckedChange={(checked) => handleSaleChange(checked as boolean)}
              />
              <Label 
                htmlFor="on-sale" 
                className="ml-2 text-sm font-medium cursor-pointer"
              >
                On Sale
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={filters.sortBy} 
            onValueChange={handleSortChange}
            className="space-y-2"
          >
            <div className="flex items-center">
              <RadioGroupItem id="featured" value="featured" />
              <Label htmlFor="featured" className="ml-2 text-sm font-medium cursor-pointer">
                Featured
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem id="newest" value="newest" />
              <Label htmlFor="newest" className="ml-2 text-sm font-medium cursor-pointer">
                Newest Arrivals
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem id="price-low-high" value="price-low-high" />
              <Label htmlFor="price-low-high" className="ml-2 text-sm font-medium cursor-pointer">
                Price: Low to High
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem id="price-high-low" value="price-high-low" />
              <Label htmlFor="price-high-low" className="ml-2 text-sm font-medium cursor-pointer">
                Price: High to Low
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem id="best-selling" value="best-selling" />
              <Label htmlFor="best-selling" className="ml-2 text-sm font-medium cursor-pointer">
                Best Selling
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}
