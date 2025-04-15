import { 
  ShoppingCart, 
  PieChart, 
  UserPlus, 
  Eye, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function DashboardStats() {
  // In a real application, this data would come from the API
  const stats = [
    {
      title: "Total Sales",
      value: 24578,
      change: 12.5,
      trend: "up",
      icon: ShoppingCart,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Total Orders",
      value: 324,
      change: 8.2,
      trend: "up",
      icon: PieChart,
      iconColor: "text-[#D9843A]",
      iconBg: "bg-[#D9843A]/10",
    },
    {
      title: "New Customers",
      value: 142,
      change: 5.7,
      trend: "up",
      icon: UserPlus,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Product Views",
      value: 8492,
      change: 3.2,
      trend: "down",
      icon: Eye,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold">
                  {stat.title.includes('Sales') ? formatCurrency(stat.value) : stat.value.toLocaleString()}
                </h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <stat.icon className={`${stat.iconColor} text-xl h-5 w-5`} />
              </div>
            </div>
            <div className="flex items-center">
              <span className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}%
              </span>
              <span className="text-neutral-500 text-sm ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
