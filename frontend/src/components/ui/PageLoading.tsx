import { LoadingSpinner } from "./LoadingSpinner";

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading data..." }: PageLoadingProps) {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <LoadingSpinner className="h-8 w-8 text-cyber-cyan" />
      <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan animate-pulse">
        {message}
      </span>
    </div>
  );
}
