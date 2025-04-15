import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon, PlusIcon, MinusIcon, ShoppingBagIcon, TrashIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartSidebar() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateItemQuantity, 
    removeItem,
    subtotal,
    shipping,
    tax,
    total,
    itemCount
  } = useCart();
  
  // Close cart when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);
  
  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);
  
  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };
  
  // Handle quantity changes
  const handleIncreaseQuantity = (item: any) => {
    if (item.quantity < item.product.stock) {
      updateItemQuantity(item.id, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };
  
  if (!isCartOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleOverlayClick}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-bold text-xl">Your Cart ({itemCount})</h3>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-grow p-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <ShoppingBagIcon className="h-16 w-16 text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-neutral-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border-b border-neutral-200 pb-4 mb-4">
                    <Link href={`/product/${item.product.id}`} className="shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </Link>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <Link href={`/product/${item.product.id}`}>
                          <h4 className="font-medium">{item.product.name}</h4>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <TrashIcon className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDecreaseQuantity(item)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                          <span className="px-2 py-1 border-x border-neutral-200">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleIncreaseQuantity(item)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold">
                          {formatCurrency(
                            parseFloat(item.product.discountPrice || item.product.price) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-neutral-200">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-neutral-500">Tax</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between mb-6 pt-4 border-t border-neutral-200">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">{formatCurrency(total)}</span>
              </div>
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition mb-2">
                  Proceed to Checkout
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full text-primary py-2"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
