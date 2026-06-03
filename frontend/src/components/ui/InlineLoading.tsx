import { LoadingSpinner } from "./LoadingSpinner";

interface InlineLoadingProps {
  message?: string;
}

export function InlineLoading({ message = "Synchronizing data..." }: InlineLoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6 px-4">
      <LoadingSpinner className="h-5 w-5 text-cyber-cyan" />
      <span className="font-mono text-[9px] uppercase tracking-widest text-fg-muted">
        {message}
      </span>
    </div>
  );
}
