import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ProductTable from "@/components/admin/ProductTable";
import ProductEditor from "@/components/admin/ProductEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { MenuIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const { user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // For authentication dialog
  const [showAuthAlert, setShowAuthAlert] = useState(!isAdmin && user !== null);

  // Fetch categories for the filter
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductEditorOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductEditorOpen(true);
  };

  const handleCloseProductEditor = () => {
    setIsProductEditorOpen(false);
    setEditingProduct(null);
  };

  const handleRedirectToLogin = () => {
    navigate("/admin/login");
  };

  if (!user) {
    return (
      <AlertDialog open={true} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to log in to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRedirectToLogin}>Log In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!isAdmin) {
    return (
      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Denied</AlertDialogTitle>
            <AlertDialogDescription>
              You don't have admin privileges to access this dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/")}>Back to Home</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar - hidden on mobile */}
      <AdminSidebar />
      
      {/* Mobile sidebar - shown when menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-neutral-900 text-white" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-neutral-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <div className="text-lg font-medium md:hidden">Products</div>
            <div></div>
          </div>
        </header>
        
        {/* Products Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <Button 
              onClick={handleCreateProduct}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New Product
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex border border-neutral-200 rounded-lg overflow-hidden w-full sm:w-auto">
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="border-none focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="ghost" className="bg-neutral-100 px-3 border-l border-neutral-200">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="in_stock">Status: In Stock</SelectItem>
                <SelectItem value="low_stock">Status: Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Status: Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ProductTable 
            searchTerm={searchTerm}
            categoryId={categoryFilter !== "all" ? parseInt(categoryFilter) : undefined}
            status={statusFilter !== "all" ? statusFilter : undefined}
            onEditProduct={handleEditProduct}
          />
          
          {/* Product Editor Modal */}
          {isProductEditorOpen && (
            <ProductEditor 
              product={editingProduct} 
              isOpen={isProductEditorOpen} 
              onClose={handleCloseProductEditor} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
