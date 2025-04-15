import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

export default function RecentOrders() {
  const { 
    data: orders, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get the most recent 4 orders
  const recentOrders = orders ? [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4) : [];

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">Failed to load recent orders.</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-4">
            <ShoppingBag className="h-8 w-8 mx-auto text-neutral-300 mb-2" />
            <p className="text-sm text-neutral-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center pb-3 border-b border-neutral-100">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <ShoppingBag className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Order #{order.id}</h4>
                    <p className="text-neutral-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm block mb-1">
                    {formatCurrency(parseFloat(order.total))}
                  </span>
                  <Badge variant={getStatusBadgeVariant(order.status) as any} className="text-xs">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="w-full text-primary">
                View All Orders
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
