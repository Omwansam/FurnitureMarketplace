import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { createOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit_card"
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="mb-6">You need to be logged in to checkout.</p>
          <Button onClick={() => navigate("/auth")}>Log In</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-6">Add some products to your cart before checking out.</p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Prepare order items from cart
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      // Create order
      const orderData = {
        userId: user.id,
        status: "pending",
        total: total.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        paymentMethod: formData.paymentMethod,
        items // This will be handled in the backend
      };
      
      await createOrder(orderData);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and is being processed."
      });
      
      // Redirect to confirmation
      navigate("/order-confirmation");
      
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "There was an error processing your order.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("state", value)}
                      defaultValue={formData.state}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 border p-4 rounded-md">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      Credit Card
                    </Label>
                    <div className="flex gap-2">
                      <div className="h-6 w-10 bg-neutral-200 rounded"></div>
                      <div className="h-6 w-10 bg-neutral-200 rounded"></div>
                      <div className="h-6 w-10 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 border p-4 rounded-md">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <div className="h-6 w-10 bg-neutral-200 rounded"></div>
                  </div>
                </RadioGroup>
                
                {formData.paymentMethod === 'credit_card' && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-8 md:hidden">
              <OrderSummary 
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 py-6"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="hidden md:block">
          <OrderSummary 
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

function OrderSummary({ cartItems, subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                <p className="font-medium">
                  {formatCurrency(
                    parseFloat(item.product.discountPrice || item.product.price) * item.quantity
                  )}
                </p>
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
