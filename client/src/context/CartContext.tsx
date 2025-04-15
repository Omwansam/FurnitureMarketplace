import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToCart, getCart, updateCartItem, removeCartItem } from "@/lib/api";
import { useAuth } from "./AuthContext";

// Define types
interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    discountPrice?: string;
    images: string[];
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  clearCart: () => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product.discountPrice 
      ? parseFloat(item.product.discountPrice) 
      : parseFloat(item.product.price);
    return total + (price * item.quantity);
  }, 0);
  
  // Fixed shipping rate for demo purposes
  const shipping = subtotal > 0 ? 29.99 : 0;
  
  // Calculate tax (10% for demo)
  const tax = subtotal * 0.1;
  
  // Calculate total
  const total = subtotal + shipping + tax;
  
  // Calculate total number of items in cart
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Load cart from server when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cartData = await getCart(user.id);
          setCartItems(cartData);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      } else {
        // Clear cart when user logs out
        setCartItems([]);
      }
    };
    
    fetchCart();
  }, [user]);
  
  // Cart functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  // Add item to cart
  const addItem = async (productId: number, quantity: number) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const addedItem = await addToCart({
        userId: user.id,
        productId,
        quantity
      });
      
      // Check if item is already in cart
      const existingItemIndex = cartItems.findIndex(
        item => item.productId === productId
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = addedItem;
        setCartItems(updatedItems);
      } else {
        // Add new item
        setCartItems([...cartItems, addedItem]);
      }
      
      toast({
        title: "Added to cart",
        description: `${addedItem.product.name} has been added to your cart.`
      });
      
      // Open cart when adding items
      openCart();
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };
  
  // Update item quantity
  const updateItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const updatedItem = await updateCartItem(cartItemId, quantity);
      
      setCartItems(cartItems.map(item => 
        item.id === cartItemId ? updatedItem : item
      ));
    } catch (error: any) {
      toast({
        title: "Error updating cart",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };
  
  // Remove item from cart
  const removeItem = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId);
      
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart."
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateItemQuantity,
      removeItem,
      itemCount,
      subtotal,
      shipping,
      tax,
      total,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
