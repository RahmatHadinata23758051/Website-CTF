import React from "react";
import { Shield, Search } from "lucide-react";
import { useAdminUsers, useUpdateUserRole, useBanUser, useUnbanUser } from "../../features/admin/users/hooks";
import type { AdminUser } from "../../features/admin/users/types";
import { AdminUserTable } from "../../components/admin/AdminUserTable";
import { AdminUserBanDialog } from "../../components/admin/AdminUserBanDialog";
import { AdminUserRoleDialog } from "../../components/admin/AdminUserRoleDialog";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Alert } from "../../components/ui/Alert";

export function AdminUsersPage() {
  // Query filters
  const [searchVal, setSearchVal] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 20;

  // Modal dialog triggers
  const [selectedBanUser, setSelectedBanUser] = React.useState<AdminUser | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = React.useState<AdminUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);

  // Debounce search value updates
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
      setPage(1); // reset to page 1 on filter/search change
    }, 300);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { data, isLoading, error } = useAdminUsers({
    search: debouncedSearch || undefined,
    role: selectedRole || undefined,
    status: selectedStatus || undefined,
    page,
    limit,
  });

  const updateRoleMutation = useUpdateUserRole();
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();

  const handleRoleChangeClick = (user: AdminUser) => {
    setSelectedRoleUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleBanClick = (user: AdminUser) => {
    setSelectedBanUser(user);
    setIsBanDialogOpen(true);
  };

  const handleUnbanClick = async (user: AdminUser) => {
    if (window.confirm(`Are you sure you want to unban the user "${user.name}"?`)) {
      try {
        await unbanMutation.mutateAsync(user.id);
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to unban user");
      }
    }
  };

  const handleConfirmRole = async (newRole: "user" | "admin") => {
    if (selectedRoleUser) {
      await updateRoleMutation.mutateAsync({
        id: selectedRoleUser.id,
        payload: { role: newRole },
      });
    }
  };

  const handleConfirmBan = async (reason: string) => {
    if (selectedBanUser) {
      await banMutation.mutateAsync({
        id: selectedBanUser.id,
        payload: { reason },
      });
    }
  };

  const resetFilters = () => {
    setSearchVal("");
    setSelectedRole("");
    setSelectedStatus("");
    setPage(1);
  };

  const hasActiveFilters = searchVal || selectedRole || selectedStatus;

  return (
    <div className="w-full space-y-8">
      {/* HEADER INDEX */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-ui pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-violet mb-1.5 uppercase tracking-wider font-bold select-none animate-pulse">
            <Shield className="h-4 w-4" />
            ADMINISTRATOR HUB // CORE USER CONTROLLER
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            User Management <span className="font-semibold text-fg-subtle">({data?.data?.pagination?.total || 0})</span>
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Inspect registered accounts, change security permission levels, and ban/unban competitors on the RBLXSec platform.
          </p>
        </div>

        {/* Counter Stats Widget */}
        <div className="flex gap-4 p-3 bg-card-bg border border-border-ui font-mono text-[10px] select-none h-fit">
          <div>
            <span className="text-fg-subtle block font-bold">TOTAL REGISTRY</span>
            <span className="text-cyber-cyan font-bold text-xs">
              {data?.data?.pagination?.total || 0} Accounts
            </span>
          </div>
          <div className="w-[1px] bg-border-ui mx-2"></div>
          <div>
            <span className="text-fg-subtle block font-bold">PAGE VIEW</span>
            <span className="text-cyber-amber font-bold text-xs">
              Page {data?.data?.pagination?.page || 1} / {data?.data?.pagination?.total_pages || 1}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card-bg border border-border-ui items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Query Search */}
          <div className="relative min-w-[200px] w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 pl-9 text-xs text-fg font-mono focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-fg-subtle" />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
            className="bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="user">User Role</option>
            <option value="admin">Admin Role</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-mono text-fg-subtle hover:text-cyber-cyan transition-colors uppercase font-bold tracking-wider cursor-pointer"
          >
            Clear Active Filter
          </button>
        )}
      </div>

      {/* ERROR ALERT DISPLAY */}
      {error && (
        <div className="py-2">
          <Alert variant="error" title="CONNECTION REJECTED" className="max-w-full">
            Unable to connect to administrative user endpoints. Please check backend config.
          </Alert>
        </div>
      )}

      {/* LOADING GRID */}
      {isLoading && (
        <div className="w-full py-16 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* USER LIST OPERATIONS TABLE */}
      {!isLoading && !error && data && (
        <div className="space-y-4">
          <AdminUserTable
            users={data.data.users}
            onRoleChangeClick={handleRoleChangeClick}
            onBanClick={handleBanClick}
            onUnbanClick={handleUnbanClick}
          />

          {/* Pagination controls */}
          {data.data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-border-ui pt-4 font-mono text-[11px] select-none">
              <span className="text-fg-subtle">
                Showing Page {data.data.pagination.page} of {data.data.pagination.total_pages} (Total: {data.data.pagination.total} users)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1"
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => Math.min(prev + 1, data.data.pagination.total_pages))}
                  disabled={page === data.data.pagination.total_pages}
                  className="px-2.5 py-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Change Modal */}
      <AdminUserRoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => {
          setIsRoleDialogOpen(false);
          setSelectedRoleUser(null);
        }}
        user={selectedRoleUser}
        onConfirm={handleConfirmRole}
      />

      {/* Ban User Modal */}
      <AdminUserBanDialog
        isOpen={isBanDialogOpen}
        onClose={() => {
          setIsBanDialogOpen(false);
          setSelectedBanUser(null);
        }}
        user={selectedBanUser}
        onConfirm={handleConfirmBan}
      />
    </div>
  );
}
