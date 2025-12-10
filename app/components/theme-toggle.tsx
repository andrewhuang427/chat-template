"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  function handleThemeChange(value: string) {
    setTheme(value);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-9 w-[72px]" />;
  }

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      value={theme}
      onValueChange={handleThemeChange}
    >
      <ToggleGroupItem value="light">
        <SunIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <MoonIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
