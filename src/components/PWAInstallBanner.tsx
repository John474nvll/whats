import { usePWA } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, X, WifiOff, Smartphone } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallBanner() {
  const { isInstallable, isUpdateAvailable, isOffline, installApp, updateApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!isInstallable && !isUpdateAvailable && !isOffline)) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        data-testid="pwa-banner"
      >
        {isOffline && (
          <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl rounded-2xl p-4 mb-2 flex items-center gap-3">
            <WifiOff className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span className="text-sm text-amber-200 font-medium">
              Sin conexi&oacute;n - Modo offline activo
            </span>
          </div>
        )}

        {isUpdateAvailable && (
          <div className="bg-primary/10 border border-primary/20 backdrop-blur-xl rounded-2xl p-4 mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-white font-medium">
                Nueva versi&oacute;n disponible
              </span>
            </div>
            <Button
              size="sm"
              onClick={updateApp}
              className="bg-primary text-black font-bold h-8"
              data-testid="button-update-app"
            >
              Actualizar
            </Button>
          </div>
        )}

        {isInstallable && (
          <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Instalar SocialHub</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Accede m&aacute;s r&aacute;pido desde tu pantalla de inicio
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={installApp}
                    className="bg-primary text-black font-bold h-9 gap-2"
                    data-testid="button-install-app"
                  >
                    <Download className="h-4 w-4" />
                    Instalar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDismissed(true)}
                    className="h-9 text-slate-400"
                    data-testid="button-dismiss-install"
                  >
                    Ahora no
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDismissed(true)}
                className="h-8 w-8 text-slate-500"
                data-testid="button-close-banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
