import { Badge } from "../ui/Badge";

interface AdminUserRoleBadgeProps {
  role: "admin" | "user" | string;
}

export function AdminUserRoleBadge({ role }: AdminUserRoleBadgeProps) {
  if (role === "admin") {
    return <Badge variant="warning">Admin</Badge>;
  }
  return <Badge variant="secondary">User</Badge>;
}
