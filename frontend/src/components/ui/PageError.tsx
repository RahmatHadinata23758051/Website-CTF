import { Alert } from "./Alert";
import { Button } from "./Button";
import { getErrorMessage } from "../../lib/error";

interface PageErrorProps {
  error: unknown;
  fallback?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function PageError({
  error,
  fallback = "Something went wrong. Please try again.",
  onRetry,
  retryText = "RETRY REQUEST",
}: PageErrorProps) {
  const message = getErrorMessage(error, fallback);

  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-12 px-4 space-y-6 animate-fade-in text-center">
      <Alert variant="error" title="OPERATION_ERROR" className="w-full max-w-md">
        {message}
      </Alert>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="font-mono text-xs uppercase tracking-wider px-6 py-2"
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}
