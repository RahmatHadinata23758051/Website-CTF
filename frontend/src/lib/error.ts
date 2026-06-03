import { isAxiosError } from "axios";

/**
 * Normalizes Axios and standard errors into a clean, user-safe message.
 * Strictly filters out SQL, database, stack trace, and filesystem details.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  let rawMessage = "";

  // 1. Check Axios error structure
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === "string") {
        rawMessage = data;
      } else if (data.message) {
        rawMessage = data.message;
      } else if (data.error) {
        rawMessage = data.error;
      }
    }
    if (!rawMessage && error.message) {
      rawMessage = error.message;
    }
  } 
  // 2. Check standard Error instance
  else if (error instanceof Error) {
    rawMessage = error.message;
  } 
  // 3. String / raw object check
  else if (typeof error === "string") {
    rawMessage = error;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    rawMessage = String((error as { message: unknown }).message);
  }

  if (!rawMessage) {
    return fallback;
  }

  // Security filters: Sanitize sensitive errors
  const lowercaseMsg = rawMessage.toLowerCase();
  
  const hasSql = lowercaseMsg.includes("sql") || lowercaseMsg.includes("select ") || lowercaseMsg.includes("insert ") || lowercaseMsg.includes("update ") || lowercaseMsg.includes("delete ");
  const hasGorm = lowercaseMsg.includes("gorm");
  const hasPostgres = lowercaseMsg.includes("postgres") || lowercaseMsg.includes("postgresql") || lowercaseMsg.includes("pq:");
  const hasDb = lowercaseMsg.includes("database") || lowercaseMsg.includes("db error") || lowercaseMsg.includes("relation \"") || lowercaseMsg.includes("connection refused");
  const hasStack = lowercaseMsg.includes("stack trace") || lowercaseMsg.includes("\tat ") || lowercaseMsg.includes("panic:") || lowercaseMsg.includes("goroutine ");
  const hasFilePath = lowercaseMsg.includes("/app/") || lowercaseMsg.includes("c:\\") || lowercaseMsg.includes("\\app\\") || lowercaseMsg.includes(".go:");

  if (hasSql || hasGorm || hasPostgres || hasDb || hasStack || hasFilePath) {
    return fallback;
  }

  return rawMessage;
}
