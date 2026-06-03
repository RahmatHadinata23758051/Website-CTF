import { SystemStatePage } from "../../components/system/SystemStatePage";

export function NotFoundPage() {
  return (
    <SystemStatePage
      code="404"
      title="Not Found!"
      message="The requested lab path does not exist or has been removed."
      mockMessage="Are you trying to directory-bust us manually? Path not found, amateur hacker."
    />
  );
}
