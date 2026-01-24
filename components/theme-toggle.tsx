import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then check system preference
    const storedTheme = localStorage.getItem("theme");
    const isDarkMode = storedTheme === "light" ? false : true;
    
    setIsDark(isDarkMode);
    
    // Apply theme
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    
    // Dispatch event for any listeners
    window.dispatchEvent(new CustomEvent("themechange", { detail: { isDark: newIsDark } }));
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        data-testid="button-theme-toggle"
      >
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="rounded-lg md:rounded-xl hover:bg-white/5 no-default-hover-elevate text-slate-400 dark:text-slate-400 h-9 w-9 md:h-10 md:w-10"
    >
      {isDark ? (
        <Sun className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <Moon className="h-4 w-4 md:h-5 md:w-5" />
      )}
    </Button>
  );
}
