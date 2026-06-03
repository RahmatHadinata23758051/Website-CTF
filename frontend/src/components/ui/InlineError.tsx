import { Alert } from "./Alert";
import { getErrorMessage } from "../../lib/error";

interface InlineErrorProps {
  error: unknown;
  fallback?: string;
  className?: string;
}

export function InlineError({
  error,
  fallback = "Action failed. Please try again.",
  className = "",
}: InlineErrorProps) {
  const message = getErrorMessage(error, fallback);

  return (
    <div className={`py-4 flex justify-start ${className}`}>
      <Alert variant="error" title="ACTION_FAILURE" className="w-full max-w-md">
        {message}
      </Alert>
    </div>
  );
}
