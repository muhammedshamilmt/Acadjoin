"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileTabsProps {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function MobileTabs({ tabs, value, onValueChange, className }: MobileTabsProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = tabs.findIndex(tab => tab.value === value);
    return index >= 0 ? index : 0;
  });

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    onValueChange(tabs[newIndex].value);
  };

  const handleNext = () => {
    const newIndex = Math.min(tabs.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    onValueChange(tabs[newIndex].value);
  };

  const currentTab = tabs[currentIndex];

  return (
    <div className={cn("flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-lg", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="flex items-center gap-1 px-2 py-1 h-auto"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-xs font-medium">Previous</span>
      </Button>

      <div className="flex-1 text-center">
        <div className="flex flex-col items-center">
          {currentTab.icon && (
            <div className="mb-1">
              {currentTab.icon}
            </div>
          )}
          <span className="text-sm font-semibold text-foreground">
            {currentTab.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} of {tabs.length}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        disabled={currentIndex === tabs.length - 1}
        className="flex items-center gap-1 px-2 py-1 h-auto"
      >
        <span className="text-xs font-medium">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
