
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, Zap, BrainCircuit, Megaphone, FolderGit2 } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Escritorio', icon: Home },
  { href: '/platforms', label: 'Plataformas', icon: Zap },
  { href: '/ai-generator', label: 'Asistente IA', icon: BrainCircuit },
  { href: '/campaigns', label: 'Campañas', icon: Megaphone },
  { href: '/projects', label: 'Proyectos', icon: FolderGit2 },
];

const QuickAccessToolbar = () => {
  return (
    <div className="bg-black/30 backdrop-blur-lg p-2 rounded-2xl border border-accent-silver/30 shadow-2xl shadow-black/50">
      <div className="flex items-center justify-center gap-2">
        {quickLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            className="flex-col h-auto px-4 py-2 rounded-xl text-xs font-bold text-light transition-all duration-300
                       hover:bg-primary/20 hover:text-primary 
                       border border-transparent hover:border-accent-gold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
            asChild
          >
            <Link href={link.href}>
              <link.icon className="w-6 h-6 mb-1" />
              <span>{link.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessToolbar;
