import { SystemStatePage } from "../../components/system/SystemStatePage";

export function UnauthorizedPage() {
  return (
    <SystemStatePage
      code="401"
      title="Unauthorized!"
      message="You need an active RBLXSec session to access this area."
      mockMessage="Session not found. Try logging in first before trying to bypass our gates, buddy."
    />
  );
}
