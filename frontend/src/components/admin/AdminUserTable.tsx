import { useAuthStore } from "../../stores/authStore";
import { AdminUserStatusBadge } from "./AdminUserStatusBadge";
import { AdminUserRoleBadge } from "./AdminUserRoleBadge";
import type { AdminUser } from "../../features/admin/users/types";
import { Ban, Unlock, Settings2 } from "lucide-react";

interface AdminUserTableProps {
  users: AdminUser[];
  onRoleChangeClick: (user: AdminUser) => void;
  onBanClick: (user: AdminUser) => void;
  onUnbanClick: (user: AdminUser) => void;
}

export function AdminUserTable({
  users,
  onRoleChangeClick,
  onBanClick,
  onUnbanClick,
}: AdminUserTableProps) {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="p-4 bg-card-bg border border-border-ui overflow-x-auto select-text">
      <table className="w-full font-sans text-xs border-collapse min-w-[800px] text-left">
        <thead>
          <tr className="border-b border-border-ui font-mono text-[9px] text-fg-subtle uppercase tracking-widest text-left select-none">
            <th className="py-3 px-4 font-bold">USER ID / PROFILE</th>
            <th className="py-3 px-4 font-bold">ROLE</th>
            <th className="py-3 px-4 font-bold">STATUS</th>
            <th className="py-3 px-4 text-center font-bold">SOLVES</th>
            <th className="py-3 px-4 text-center font-bold">POINTS</th>
            <th className="py-3 px-4 font-bold">JOINED DATE</th>
            <th className="py-3 px-4 text-right font-bold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = !!(currentUser && currentUser.id === user.id);
            return (
              <tr
                key={user.id}
                className={`border-b border-border-subtle font-mono hover:bg-surface/50 transition-colors ${
                  isSelf ? "bg-cyber-cyan/5 border-l-2 border-l-cyber-cyan" : ""
                }`}
              >
                <td className="py-3.5 px-4">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-fg uppercase tracking-wide">
                        {user.name}
                      </span>
                      {isSelf && (
                        <span className="bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 px-1.5 py-0.2 font-mono text-[8px] uppercase tracking-wider font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-fg-muted font-sans lowercase mt-0.5 select-all">
                      {user.email}
                    </span>
                    <span className="text-[8px] text-fg-subtle select-all mt-0.5">
                      {user.id}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 select-none">
                  <AdminUserRoleBadge role={user.role} />
                </td>
                <td className="py-3.5 px-4 select-none">
                  <div className="flex flex-col">
                    <AdminUserStatusBadge isBanned={user.is_banned} />
                    {user.is_banned && user.banned_reason && (
                      <span className="text-[9px] text-cyber-crimson font-sans mt-1 max-w-[200px] truncate" title={user.banned_reason}>
                        Reason: {user.banned_reason}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center text-fg-muted font-bold select-none">
                  {user.total_solves} solves
                </td>
                <td className="py-3.5 px-4 text-center text-[#7B9FFF] font-black select-none">
                  {user.total_points} pts
                </td>
                <td className="py-3.5 px-4 text-fg-subtle select-none font-bold">
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right select-none">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Role edit button */}
                    <button
                      type="button"
                      disabled={isSelf || user.is_banned}
                      onClick={() => onRoleChangeClick(user)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-border-ui text-fg-muted hover:text-cyber-cyan hover:border-cyber-cyan/40 disabled:opacity-30 disabled:hover:text-fg-muted disabled:hover:border-border-ui font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
                      title={user.is_banned ? "Cannot change role of banned user" : "Modify User Role"}
                    >
                      <Settings2 className="h-3 w-3" />
                      Role
                    </button>

                    {/* Ban / Unban buttons */}
                    {user.is_banned ? (
                      <button
                        type="button"
                        onClick={() => onUnbanClick(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-border-ui text-cyber-emerald hover:bg-cyber-emerald/10 hover:border-cyber-emerald/40 font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        title="Unban Account"
                      >
                        <Unlock className="h-3 w-3" />
                        Unban
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => onBanClick(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-border-ui text-cyber-crimson hover:bg-cyber-crimson/10 hover:border-cyber-crimson/40 disabled:opacity-30 disabled:hover:text-cyber-crimson disabled:hover:border-border-ui font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
                        title={isSelf ? "You cannot ban yourself" : "Ban Account"}
                      >
                        <Ban className="h-3 w-3" />
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
