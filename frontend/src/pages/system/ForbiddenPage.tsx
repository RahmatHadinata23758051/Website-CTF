import { SystemStatePage } from "../../components/system/SystemStatePage";

export function ForbiddenPage() {
  return (
    <SystemStatePage
      code="403"
      title="Forbidden!"
      message="Your current account does not have permission to access this console."
      mockMessage="Access denied, script kiddie. Keep trying, maybe your brute-forcer will work in the next century."
    />
  );
}
