import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SearchIcon, HeartIcon, ShoppingCartIcon, MenuIcon, UserIcon } from "lucide-react";
import CartSidebar from "../shop/CartSidebar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logoutMutation } = useAuth();
  const isAdmin = user?.isAdmin || false;
  const { itemCount, openCart } = useCart();
  const [, navigate] = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [useLocation()[0]]);
  
  return (
    <>
      <header className={`bg-white sticky top-0 z-50 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Furnish<span className="text-[#D9843A]">Home</span></span>
            </Link>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden md:block w-1/3">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for furniture..."
                  className="w-full py-2 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-700"
                >
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </form>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-neutral-700 hover:text-primary transition">Home</Link>
              <Link href="/shop" className="text-neutral-700 hover:text-primary transition">Shop</Link>
              <Link href="/shop/living-room" className="text-neutral-700 hover:text-primary transition">Collections</Link>
              <Link href="/about" className="text-neutral-700 hover:text-primary transition">About</Link>
              <Link href="/contact" className="text-neutral-700 hover:text-primary transition">Contact</Link>
            </nav>
            
            {/* Icons */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary transition">
                    {user ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white text-xs">
                          {user.firstName?.charAt(0) || user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user.firstName || user.username}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/auth">Login / Register</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary transition">
                <HeartIcon className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-neutral-700 hover:text-primary transition relative"
                onClick={openCart}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D9843A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-neutral-700"
                onClick={toggleMobileMenu}
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar (Mobile) */}
          <div className="pb-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for furniture..."
                className="w-full py-2 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-700"
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="px-4 pt-2 pb-4 bg-white border-t border-neutral-200 md:hidden">
            <Link href="/" className="block py-2 text-neutral-700 hover:text-primary transition">Home</Link>
            <Link href="/shop" className="block py-2 text-neutral-700 hover:text-primary transition">Shop</Link>
            <Link href="/shop/living-room" className="block py-2 text-neutral-700 hover:text-primary transition">Collections</Link>
            <Link href="/about" className="block py-2 text-neutral-700 hover:text-primary transition">About</Link>
            <Link href="/contact" className="block py-2 text-neutral-700 hover:text-primary transition">Contact</Link>
          </nav>
        )}
      </header>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
