import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis 
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  // Sample data for the revenue chart
  // In a real application, this would come from an API
  const data = {
    weekly: [
      { name: "Mon", revenue: 1250 },
      { name: "Tue", revenue: 1800 },
      { name: "Wed", revenue: 1500 },
      { name: "Thu", revenue: 2100 },
      { name: "Fri", revenue: 2400 },
      { name: "Sat", revenue: 3200 },
      { name: "Sun", revenue: 2600 },
    ],
    monthly: [
      { name: "Jan", revenue: 5240 },
      { name: "Feb", revenue: 7850 },
      { name: "Mar", revenue: 3600 },
      { name: "Apr", revenue: 6580 },
      { name: "May", revenue: 5400 },
      { name: "Jun", revenue: 8400 },
      { name: "Jul", revenue: 10200 },
      { name: "Aug", revenue: 11400 },
      { name: "Sep", revenue: 9000 },
      { name: "Oct", revenue: 7200 },
      { name: "Nov", revenue: 6000 },
      { name: "Dec", revenue: 4800 },
    ],
    yearly: [
      { name: "2018", revenue: 42000 },
      { name: "2019", revenue: 58000 },
      { name: "2020", revenue: 36000 },
      { name: "2021", revenue: 90000 },
      { name: "2022", revenue: 120000 },
    ],
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Revenue Overview</h3>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === "weekly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange("weekly")}
            >
              Weekly
            </Button>
            <Button 
              variant={timeRange === "monthly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange("monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant={timeRange === "yearly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange("yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data[timeRange]}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A6D8C" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4A6D8C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4A6D8C"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
