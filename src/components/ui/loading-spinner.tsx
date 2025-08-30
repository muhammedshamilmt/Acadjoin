import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const variantClasses = {
  default: 'border-gray-300 border-t-gray-600',
  primary: 'border-primary/30 border-t-primary',
  secondary: 'border-secondary/30 border-t-secondary'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'primary'
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-t-transparent',
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{
          animationDuration: '0.6s' // Faster animation
        }}
      />
      {text && (
        <p className="text-sm text-muted-foreground mt-2 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Optimized full-screen loading component
export const FullScreenLoader: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = 'Loading...', className }) => {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-background', className)}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

// Optimized page loading component with navbar
export const PageLoader: React.FC<{
  text?: string;
  showNavbar?: boolean;
}> = ({ text = 'Loading...', showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <div className="h-16" />} {/* Placeholder for navbar */}
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

// Skeleton loading component for content
export const Skeleton: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className, lines = 1 }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{
            animationDuration: '1s',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Card skeleton for institute/people cards
export const CardSkeleton: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn('bg-card rounded-lg border p-6 space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
};
