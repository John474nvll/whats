import { useState } from 'react';
import { useContacts, useDeleteContact } from '@/hooks/use-contacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  MessageCircle,
  Instagram,
  Facebook,
  User,
} from 'lucide-react';
import { ContactForm } from '@/components/crm/ContactForm';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  const { data: contacts, isLoading } = useContacts();
  const deleteContact = useDeleteContact();

  const filteredContacts =
    contacts?.filter((c) => {
      const searchMatch =
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const platformMatch =
        platformFilter === 'all' || c.platform === platformFilter;
      return searchMatch && platformMatch;
    }) || [];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Contactos
            </h1>
            <p className="text-muted-foreground text-lg">
              Administra tu base de datos de contactos y audiencias
            </p>
          </div>
          <ContactForm />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-slate-800/50 border-slate-700 h-11 rounded-lg text-sm pl-3 pr-8 w-full md:w-auto"
            >
              <option value="all">Todas las plataformas</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>

        {/* Contacts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700"
              />
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">
                No se encontraron contactos.
              </p>
              <ContactForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 truncate">
                    {getPlatformIcon(contact.platform)}
                    <span className="truncate">{contact.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-400">📱 {contact.phone}</p>
                  <div className="flex gap-2 pt-2">
                    <ContactForm contact={contact} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9"
                      onClick={() => deleteContact.mutate(contact.id)}
                      disabled={deleteContact.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
