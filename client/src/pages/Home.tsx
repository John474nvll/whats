import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Sparkles, BarChart3, MessageSquare, Users, TrendingUp, Check } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    { icon: MessageSquare, title: "Unified Inbox", desc: "All messages in one place" },
    { icon: Users, title: "Team Management", desc: "Collaborate with your team" },
    { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights & reporting" },
    { icon: Sparkles, title: "AI Assistant", desc: "Smart content generation" },
    { icon: TrendingUp, title: "Growth Tools", desc: "Optimize your reach" },
    { icon: Zap, title: "Automation", desc: "Save time with workflows" },
  ];

  const benefits = [
    "Manage Instagram, Facebook, WhatsApp & TikTok from one dashboard",
    "AI-powered content suggestions and scheduling",
    "Real-time analytics and performance tracking",
    "Team collaboration and role management",
    "Secure API connections and data encryption",
    "24/7 customer support and updates",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-md overflow-hidden flex items-center justify-center">
              <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="font-black text-lg">Social<span className="text-primary">Hub</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setLocation("/")} className="text-slate-300 hover:text-white">
            Features
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 font-black rounded-lg" onClick={() => setLocation("/")}>
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-24 px-6 text-center max-w-6xl mx-auto"
      >
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
          Master Your Social <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Media Empire</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          The ultimate platform for managing all your social media accounts, teams, and campaigns in one unified dashboard.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 font-black rounded-lg text-base px-8"
            onClick={() => setLocation("/")}
          >
            Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 hover:border-primary/50 font-black rounded-lg text-base">
            View Demo
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4 tracking-tight">Powerful Features</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Everything you need to succeed in social media management</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-black text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 tracking-tight">Why Choose SocialHub?</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-slate-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
            <Card className="relative border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.15),transparent_50%)]" />
                <div className="relative z-10 text-center">
                  <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 font-bold">Dashboard Preview</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6 tracking-tight">Ready to Transform Your Social Media?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of businesses already using SocialHub</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-lg hover:shadow-primary/50 font-black rounded-lg text-base px-10"
            onClick={() => setLocation("/")}
          >
            Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 border-t border-white/10 py-8 px-6 text-center text-slate-400 backdrop-blur-xl"
      >
        <p>© 2025 SocialHub. All rights reserved. | Made with passion for social media creators</p>
      </motion.footer>
    </div>
  );
}
