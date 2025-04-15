import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getOrders, updateOrderStatus } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuIcon, SearchIcon, EyeIcon, PackageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // For authentication dialog
  const [showAuthAlert, setShowAuthAlert] = useState(!isAdmin && user !== null);

  // Fetch orders
  const { 
    data: orders, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['/api/orders'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleRedirectToLogin = () => {
    navigate("/admin/login");
  };

  const viewOrderDetails = (order: any) => {
    setViewingOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setViewingOrder(null);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!viewingOrder) return;
    
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(viewingOrder.id, newStatus);
      
      // Update local state
      setViewingOrder({
        ...viewingOrder,
        status: newStatus
      });
      
      // Refetch orders to update the list
      refetch();
      
      toast({
        title: "Order status updated",
        description: `Order #${viewingOrder.id} status changed to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update order status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders ? orders.filter((order: any) => {
    const matchesSearch = searchTerm === "" || 
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || 
      order.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  }) : [];

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

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

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
            <div className="text-lg font-medium md:hidden">Orders</div>
            <div></div>
          </div>
        </header>
        
        {/* Orders Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-neutral-500">View and manage customer orders</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex border border-neutral-200 rounded-lg overflow-hidden w-full sm:w-auto">
              <Input 
                type="text" 
                placeholder="Search order #..." 
                className="border-none focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="ghost" className="bg-neutral-100 px-3 border-l border-neutral-200">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="pending">Status: Pending</SelectItem>
                <SelectItem value="processing">Status: Processing</SelectItem>
                <SelectItem value="completed">Status: Completed</SelectItem>
                <SelectItem value="cancelled">Status: Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <PackageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-neutral-500">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "There are no orders yet"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>User #{order.userId}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(order.total))}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status) as any}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Order Details Modal */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={closeOrderDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{viewingOrder?.id}</DialogTitle>
            <DialogDescription>
              {viewingOrder && (
                <span>
                  Placed on {new Date(viewingOrder.createdAt).toLocaleDateString()} by User #{viewingOrder.userId}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm text-neutral-600">{viewingOrder.address || "Not provided"}</p>
                  <p className="text-sm text-neutral-600">
                    {viewingOrder.city} {viewingOrder.state} {viewingOrder.zipCode}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <p className="text-sm text-neutral-600">
                    {viewingOrder.paymentMethod === 'credit_card' 
                      ? 'Credit Card' 
                      : viewingOrder.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : viewingOrder.paymentMethod || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Order Status</h4>
                  <Select 
                    value={viewingOrder.status} 
                    onValueChange={handleUpdateStatus}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="bg-neutral-50 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Mock order items since our API doesn't return them in this view */}
                      <TableRow>
                        <TableCell className="font-medium">Product #1</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>{formatCurrency(299.99)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(299.99)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Product #2</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>{formatCurrency(149.99)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(299.98)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(parseFloat(viewingOrder.total) - parseFloat(viewingOrder.shipping) - parseFloat(viewingOrder.tax))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(parseFloat(viewingOrder.shipping))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(parseFloat(viewingOrder.tax))}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(parseFloat(viewingOrder.total))}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeOrderDetails}>Close</Button>
            {viewingOrder?.status !== 'completed' && viewingOrder?.status !== 'cancelled' && (
              <Button onClick={() => handleUpdateStatus('completed')} disabled={updatingStatus}>
                Mark as Completed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
