import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboardIcon, 
  LineChartIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  PercentIcon,
  ShoppingCartIcon,
  UserIcon,
  RefreshCcwIcon,
  Settings2Icon,
  UserCogIcon,
  LogOutIcon
} from "lucide-react";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <aside className="bg-neutral-900 text-white w-64 flex-shrink-0 hidden md:block h-screen sticky top-0">
      <div className="p-4 border-b border-neutral-800">
        <span className="text-xl font-bold">Furnish<span className="text-[#D9843A]">Home</span></span>
        <div className="text-xs text-neutral-400 mt-1">Admin Portal</div>
      </div>
      
      <nav className="p-4">
        <div className="mb-2 text-xs text-neutral-400 uppercase tracking-wider">Dashboard</div>
        <Link href="/admin">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <LayoutDashboardIcon className="mr-3 h-4 w-4" />
            <span>Overview</span>
          </Button>
        </Link>
        <Link href="/admin/analytics">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/analytics") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <LineChartIcon className="mr-3 h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </Link>
        
        <div className="mt-6 mb-2 text-xs text-neutral-400 uppercase tracking-wider">Catalog</div>
        <Link href="/admin/products">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/products") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <ShoppingBagIcon className="mr-3 h-4 w-4" />
            <span>Products</span>
          </Button>
        </Link>
        <Link href="/admin/categories">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/categories") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <TagIcon className="mr-3 h-4 w-4" />
            <span>Categories</span>
          </Button>
        </Link>
        <Link href="/admin/discounts">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/discounts") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <PercentIcon className="mr-3 h-4 w-4" />
            <span>Discounts</span>
          </Button>
        </Link>
        
        <div className="mt-6 mb-2 text-xs text-neutral-400 uppercase tracking-wider">Sales</div>
        <Link href="/admin/orders">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/orders") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <ShoppingCartIcon className="mr-3 h-4 w-4" />
            <span>Orders</span>
          </Button>
        </Link>
        <Link href="/admin/customers">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/customers") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <UserIcon className="mr-3 h-4 w-4" />
            <span>Customers</span>
          </Button>
        </Link>
        <Link href="/admin/returns">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/returns") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <RefreshCcwIcon className="mr-3 h-4 w-4" />
            <span>Returns</span>
          </Button>
        </Link>
        
        <div className="mt-6 mb-2 text-xs text-neutral-400 uppercase tracking-wider">Settings</div>
        <Link href="/admin/users">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/users") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <UserCogIcon className="mr-3 h-4 w-4" />
            <span>User Management</span>
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full justify-start py-2 px-3 mb-1 rounded text-sm font-medium",
              isActive("/admin/settings") 
                ? "bg-primary/20 text-white" 
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            <Settings2Icon className="mr-3 h-4 w-4" />
            <span>Store Settings</span>
          </Button>
        </Link>
        
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <Button 
            variant="ghost" 
            className="flex items-center w-full justify-start py-2 px-3 rounded text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800"
            onClick={logout}
          >
            <LogOutIcon className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
