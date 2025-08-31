import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingToastProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  className?: string;
}

export const LoadingToast: React.FC<LoadingToastProps> = ({
  title,
  description,
  isLoading = true,
  isSuccess = false,
  className
}) => {
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 bg-white border border-border rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]",
      className
    )}>
      {/* Gradient Loading Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-lg overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" 
               style={{
                 animation: 'shimmer 2s infinite',
                 background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                 backgroundSize: '200% 100%'
               }}
          />
        </div>
      )}
      
      <div className="flex items-start gap-3 pt-1">
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
