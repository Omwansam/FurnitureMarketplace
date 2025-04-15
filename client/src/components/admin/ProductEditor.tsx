import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getCategories, createProduct, updateProduct } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Trash } from "lucide-react";

interface ProductEditorProps {
  product?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditor({ product, isOpen, onClose }: ProductEditorProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Initial form state
  const initialState = {
    name: "",
    sku: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    stock: "0",
    status: "in_stock",
    featured: false,
    isNew: false,
    images: []
  };
  
  const [formData, setFormData] = useState(initialState);
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        categoryId: product.categoryId ? product.categoryId.toString() : "",
        stock: product.stock ? product.stock.toString() : "0",
        status: product.status || "in_stock",
        featured: product.featured || false,
        isNew: product.isNew || false,
        images: product.images || []
      });
    } else {
      setFormData(initialState);
    }
  }, [product]);
  
  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && (!product || formData.name !== product.name)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [formData.name, product]);
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Add image URL
  const handleAddImage = () => {
    // Prompt for image URL - in a real app would use file upload
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };
  
  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Format the data
      const productData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        stock: parseInt(formData.stock),
        featured: !!formData.featured,
        isNew: !!formData.isNew
      };
      
      if (product) {
        // Update existing product
        await updateProduct(product.id, productData);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully."
        });
      } else {
        // Create new product
        await createProduct(productData);
        toast({
          title: "Product created",
          description: "The new product has been created successfully."
        });
      }
      
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Close the modal
      onClose();
      
    } catch (error: any) {
      toast({
        title: product ? "Failed to update product" : "Failed to create product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sku">Product ID/SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="discountPrice">Discount Price ($)</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isNew" 
                checked={formData.isNew}
                onCheckedChange={(checked) => handleCheckboxChange("isNew", checked as boolean)}
              />
              <Label htmlFor="isNew">New Arrival</Label>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <Label className="mb-2 block">Product Images</Label>
            <div className="border border-dashed border-neutral-300 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Product image ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="border-dashed border-neutral-300 h-20 flex flex-col items-center justify-center hover:bg-neutral-50"
                  onClick={handleAddImage}
                >
                  <Upload className="h-5 w-5 text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-500">Add Image</span>
                </Button>
              </div>
              
              <div className="text-xs text-neutral-500">
                Add image URLs. Maximum 5 images.
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
