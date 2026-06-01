import { Badge } from "../ui/Badge";

interface AdminUserStatusBadgeProps {
  isBanned: boolean;
}

export function AdminUserStatusBadge({ isBanned }: AdminUserStatusBadgeProps) {
  if (isBanned) {
    return <Badge variant="danger">Banned</Badge>;
  }
  return <Badge variant="success">Active</Badge>;
}
