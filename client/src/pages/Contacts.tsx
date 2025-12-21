import { useState } from "react";
import { useContacts, useCreateContact } from "@/hooks/use-contacts";
import { Plus, Search, User, Phone, Instagram, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const { data: contacts, isLoading } = useContacts();
  const createContact = useCreateContact();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      platform: "whatsapp",
    },
  });

  const onSubmit = (data: InsertContact) => {
    createContact.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        toast({ title: "Contact created successfully" });
      },
      onError: (err) => {
        toast({ title: "Failed to create contact", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Contacts</h1>
              <p className="text-muted-foreground mt-1">Manage your audience and customers.</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search contacts..." 
                  className="pl-9 pr-4 py-2 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
                />
              </div>
              
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-background/50" value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone / ID</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} className="bg-background/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createContact.isPending}>
                        {createContact.isPending ? "Creating..." : "Create Contact"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-card animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts?.map((contact) => (
                <div 
                  key={contact.id}
                  className="group p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {contact.platform === 'whatsapp' ? <Phone className="h-4 w-4 text-green-500" /> :
                     contact.platform === 'instagram' ? <Instagram className="h-4 w-4 text-pink-500" /> :
                     <Facebook className="h-4 w-4 text-blue-500" />}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border group-hover:ring-primary/20 transition-all">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center text-xs text-muted-foreground">
                    <span>Added {new Date(contact.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="bg-secondary px-2 py-1 rounded-md capitalize">{contact.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
