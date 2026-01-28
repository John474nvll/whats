import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Target, ArrowRight, User, TrendingUp } from 'lucide-react';

const stages = [
  {
    id: 'new',
    label: 'Nuevo Lead',
    color: 'bg-primary/20 text-primary border-primary/30',
  },
  {
    id: 'contacting',
    label: 'Contactando',
    color: 'bg-kiwi/20 text-kiwi border-kiwi/30',
  },
  {
    id: 'qualified',
    label: 'Cualificado',
    color: 'bg-cyan-neon/20 text-cyan-neon border-cyan-neon/30',
  },
  {
    id: 'won',
    label: 'Ganado',
    color: 'bg-accent/20 text-accent border-accent/30',
  },
];

interface Customer {
  id: number;
  name: string;
  leadStatus: string;
  estimatedValue?: string | number | null;
}

export function SalesPipeline({ customers = [] }: { customers: Customer[] }) {
  return (
    <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Pipeline de Ventas Softgan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const stageCustomers = customers.filter(
              (c) => c.leadStatus === stage.id,
            );
            return (
              <div key={stage.id} className="space-y-3">
                <div
                  className={`p-3 rounded-xl border ${stage.color} flex items-center justify-between shadow-lg shadow-black/20`}
                >
                  <span className="text-xs font-black uppercase tracking-wider">
                    {stage.label}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white font-black"
                  >
                    {stageCustomers.length}
                  </Badge>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {stageCustomers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/10 text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {customer.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            ${customer.estimatedValue || 0}
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-primary transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
