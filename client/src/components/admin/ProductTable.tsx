import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PencilIcon, EyeIcon, Trash2Icon, PackageIcon } from "lucide-react";
import { formatCurrency, getStockStatusClass, getStockStatusText } from "@/lib/utils";

interface ProductTableProps {
  searchTerm?: string;
  categoryId?: number;
  status?: string;
  onEditProduct: (product: any) => void;
}

export default function ProductTable({ 
  searchTerm = "", 
  categoryId,
  status,
  onEditProduct 
}: ProductTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    data: products, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const productsPerPage = 10;
  
  // Filter products based on search, category, and status
  const filteredProducts = products ? products.filter((product: any) => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryId ? product.categoryId === categoryId : true;
    
    // Status filter
    const matchesStatus = status ? product.status === status : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  // View product details
  const handleViewProduct = (productSlug: string) => {
    // Open product in a new tab
    window.open(`/product/${productSlug}`, '_blank');
  };
  
  // Delete product
  const openDeleteConfirm = (productId: number) => {
    setConfirmDelete(productId);
  };
  
  const closeDeleteConfirm = () => {
    setConfirmDelete(null);
  };
  
  const handleDeleteProduct = async () => {
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(confirmDelete);
      
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };
  
  // Get category name based on ID
  const getCategoryName = (categoryId: number) => {
    switch(categoryId) {
      case 1: return "Living Room";
      case 2: return "Bedroom";
      case 3: return "Kitchen & Dining";
      case 4: return "Office";
      default: return "Other";
    }
  };
  
  // Pagination controls
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-full max-w-[300px]" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500 py-8">
            Error loading products. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (filteredProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <PackageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-neutral-500">
            {searchTerm || categoryId || status
              ? "Try adjusting your filters to find what you're looking for."
              : "Start by adding your first product."}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <img 
                          src={product.images[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-500">{product.sku}</TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell className="font-medium">
                      {product.discountPrice ? (
                        <div>
                          <span>{formatCurrency(parseFloat(product.discountPrice))}</span>
                          <span className="text-sm text-neutral-400 line-through ml-2">
                            {formatCurrency(parseFloat(product.price))}
                          </span>
                        </div>
                      ) : (
                        formatCurrency(parseFloat(product.price))
                      )}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={getStockStatusClass(product.status)}>
                        {getStockStatusText(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:bg-primary/10 rounded"
                          onClick={() => onEditProduct(product)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-500 hover:bg-neutral-100 rounded"
                          onClick={() => handleViewProduct(product.slug)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-100 rounded"
                          onClick={() => openDeleteConfirm(product.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <p className="text-neutral-500 text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDelete !== null} onOpenChange={closeDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
