import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { formatCurrency, calculateDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { addItem } = useCart();
  
  // Calculate discount percentage if discountPrice exists
  const discount = product.discountPrice 
    ? calculateDiscount(product.price, product.discountPrice) 
    : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wishlist functionality would be implemented here
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
          onClick={handleAddToWishlist}
        >
          <Heart className="h-5 w-5 text-neutral-700" />
        </Button>
        
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#D9843A] hover:bg-[#D9843A]/90">New</Badge>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive">-{discount}%</Badge>
          </div>
        )}
        
        {/* Add to cart overlay on hover */}
        {isHovering && product.stock > 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-neutral-700 text-sm mb-2">
          {/* Get category name based on categoryId */}
          {product.categoryId === 1 ? 'Living Room' :
           product.categoryId === 2 ? 'Bedroom' :
           product.categoryId === 3 ? 'Kitchen & Dining' :
           product.categoryId === 4 ? 'Office' : 'Other'}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{formatCurrency(parseFloat(product.discountPrice))}</span>
                <span className="text-neutral-500 text-sm line-through">{formatCurrency(parseFloat(product.price))}</span>
              </div>
            ) : (
              <span className="font-bold text-lg">{formatCurrency(parseFloat(product.price))}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="flex items-center text-sm text-neutral-700">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{product.rating}</span>
            </span>
          </div>
        </div>
        
        {product.stock <= 0 && (
          <div className="mt-2">
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              Out of Stock
            </Badge>
          </div>
        )}
        
        <Button 
          className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
