import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

export const StatCard = ({
  label,
  value,
  change,
  icon: Icon,
  color,
  trend,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-16 -mt-16">
        <Icon className="w-full h-full" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${color} shadow-lg shadow-current/20`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-bold gap-1 ${
              trend === 'up'
                ? 'text-green-500 border-green-500/30 bg-green-500/10'
                : trend === 'down'
                  ? 'text-red-500 border-red-500/30 bg-red-500/10'
                  : 'text-slate-500 border-slate-500/30 bg-slate-500/10'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </Badge>
        </div>
        <h3 className="text-3xl font-black text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground font-semibold">{label}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export const customerGrowthData = (customers: any[]) => {
  const sortedCustomers = customers.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const data: { date: string; count: number }[] = [];
  let cumulativeCount = 0;
  sortedCustomers.forEach((customer) => {
    cumulativeCount++;
    data.push({
      date: new Date(customer.createdAt).toLocaleDateString(),
      count: cumulativeCount,
    });
  });
  return data;
};
