import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProductReviews } from "@/lib/api";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Star, 
  Check,
  ArrowLeft
} from "lucide-react";
import { formatCurrency, calculateDiscount } from "@/lib/utils";

interface ProductDetailProps {
  productSlug: string;
}

export default function ProductDetail({ productSlug }: ProductDetailProps) {
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: [`/api/products/slug/${productSlug}`],
    queryFn: () => getProductBySlug(productSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch reviews after we have the product
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/products/${product?.id}/reviews`],
    queryFn: () => getProductReviews(product.id),
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Reset quantity and selected image when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);

  // Handle quantity changes
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.name} has been added to your wishlist.`
    });
  };

  // Back to shop
  const goBack = () => {
    navigate("/shop");
  };

  if (productError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={goBack}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={goBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex mt-4 gap-4">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = product.discountPrice 
    ? calculateDiscount(product.price, product.discountPrice) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Button>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex mt-4 gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 rounded-md cursor-pointer border-2 overflow-hidden ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(parseFloat(product.rating)) ? 'fill-yellow-400' : ''}`} 
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              {product.rating} ({reviews?.length || 0} reviews)
            </span>
          </div>
          
          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(parseFloat(product.discountPrice))}</span>
                <span className="text-lg text-neutral-500 line-through">{formatCurrency(parseFloat(product.price))}</span>
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold">{formatCurrency(parseFloat(product.price))}</span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-neutral-700">{product.description}</p>
          </div>
          
          {/* Stock Status */}
          <div className="mb-6 flex items-center">
            <span className="mr-2">Availability:</span>
            {product.stock > 0 ? (
              <span className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" />
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
          
          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity} 
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity} 
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Add to Cart & Wishlist */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="flex-1 py-6" 
              onClick={handleAddToCart} 
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" className="py-6" onClick={handleAddToWishlist}>
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>
          
          {/* SKU and Category */}
          <div className="text-sm text-neutral-500">
            <p>SKU: {product.sku}</p>
            <p>Category: {
              product.categoryId === 1 ? 'Living Room' :
              product.categoryId === 2 ? 'Bedroom' :
              product.categoryId === 3 ? 'Kitchen & Dining' :
              product.categoryId === 4 ? 'Office' : 'Other'
            }</p>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12 mb-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              {/* Additional description would go here */}
              <p>
                Our furniture pieces are crafted with the highest quality materials and designed to last.
                Each item undergoes rigorous quality testing to ensure durability and comfort.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Dimensions</h3>
                <ul className="space-y-1 text-neutral-700">
                  <li>Length: 80 cm</li>
                  <li>Width: 60 cm</li>
                  <li>Height: 45 cm</li>
                </ul>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Materials</h3>
                <ul className="space-y-1 text-neutral-700">
                  <li>Frame: Solid Oak</li>
                  <li>Upholstery: Premium Fabric</li>
                  <li>Legs: Metal with Powder Coating</li>
                </ul>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Care Instructions</h3>
                <ul className="space-y-1 text-neutral-700">
                  <li>Dust regularly with a soft, dry cloth</li>
                  <li>Avoid direct sunlight</li>
                  <li>Clean spills immediately</li>
                </ul>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Warranty</h3>
                <ul className="space-y-1 text-neutral-700">
                  <li>2-year manufacturer warranty</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400' : ''}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        Verified Purchase
                      </span>
                    </div>
                    <p className="mb-2">{review.review}</p>
                    <p className="text-sm text-neutral-500">
                      Review by User #{review.userId} on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
