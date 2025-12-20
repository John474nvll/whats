import { Sidebar } from "@/components/Sidebar";
import { Users, Search, MoreHorizontal, Mail, Phone } from "lucide-react";

export default function Contacts() {
  // Placeholder contacts page - implementation would be similar to Inbox list but with a grid
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="p-8 max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Contacts</h1>
              <p className="text-muted-foreground mt-1">Manage your customer database across all platforms</p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
              Add Contact
            </button>
          </header>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-8 flex gap-4 items-center shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="Search contacts..." 
                className="w-full pl-9 pr-4 py-2 bg-muted/30 rounded-lg border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary">
              <option>All Channels</option>
              <option>WhatsApp</option>
              <option>Facebook</option>
            </select>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card hover:border-primary/50 transition-colors border border-border rounded-2xl p-6 shadow-sm group relative">
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4 flex items-center justify-center text-2xl font-bold text-primary">
                    JD
                  </div>
                  <h3 className="font-bold text-lg text-foreground">John Doe</h3>
                  <p className="text-sm text-muted-foreground">@johndoe • WhatsApp</p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
