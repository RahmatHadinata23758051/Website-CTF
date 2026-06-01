import React from "react";
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  XCircle,
  FolderLock,
  X,
  Loader2,
  Lightbulb,
} from "lucide-react";
import {
  useAdminChallenges,
  useCreateAdminChallenge,
  useUpdateAdminChallenge,
  useUpdateAdminChallengeStatus,
  useDeleteAdminChallenge,
} from "../features/challenges/adminHooks";
import type { AdminChallenge, AdminChallengeRequest } from "../features/challenges/types";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { DifficultyBadge } from "../components/ctf/DifficultyBadge";
import { CategoryBadge } from "../components/ctf/CategoryBadge";
import { AdminAttachmentUpload } from "../components/admin/AdminAttachmentUpload";
import { AdminHintManager } from "../components/admin/AdminHintManager";

interface FormState {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  points: string; // string for input binding, parsed on submit
  description: string;
  flag: string;
  attachment_url: string;
  external_link: string;
  is_active: boolean;
}

const initialFormState: FormState = {
  title: "",
  slug: "",
  category: "Web Exploitation",
  difficulty: "Easy",
  points: "100",
  description: "",
  flag: "",
  attachment_url: "",
  external_link: "",
  is_active: true,
};

const categoriesList = [
  "Web Exploitation",
  "Reverse Engineering",
  "Cryptography",
  "Forensics",
  "Pwn",
  "OSINT",
  "Steganography",
  "Miscellaneous",
];

const difficultiesList = ["Easy", "Medium", "Hard", "Insane"];

export function AdminChallengesPage() {
  const { data: challenges = [], isLoading, error } = useAdminChallenges();

  const createMutation = useCreateAdminChallenge();
  const updateStatusMutation = useUpdateAdminChallengeStatus();
  const deleteMutation = useDeleteAdminChallenge();

  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingChallenge, setEditingChallenge] = React.useState<AdminChallenge | null>(null);
  const [formData, setFormData] = React.useState<FormState>(initialFormState);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [hintManagerChallenge, setHintManagerChallenge] = React.useState<AdminChallenge | null>(null);

  // Hook for update mutation (instantiated conditionally with selected id)
  const updateMutation = useUpdateAdminChallenge(editingChallenge?.id || "");

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingChallenge(null);
    setFormData(initialFormState);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (ch: AdminChallenge) => {
    setEditingChallenge(ch);
    setFormData({
      title: ch.title,
      slug: ch.slug,
      category: ch.category,
      difficulty: ch.difficulty,
      points: ch.points.toString(),
      description: ch.description,
      flag: "", // Always empty by default for security, if left blank GORM preserves hash
      attachment_url: ch.attachment_url || "",
      external_link: ch.external_link || "",
      is_active: ch.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Status toggle handler
  const handleToggleStatus = async (ch: AdminChallenge) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: ch.id,
        isActive: !ch.is_active,
      });
    } catch {
      // Handled by React Query or default fallbacks
    }
  };

  // Delete challenge handler
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch {
      // Failed action
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }
    const pts = parseInt(formData.points, 10);
    if (isNaN(pts) || pts <= 0) {
      setFormError("Points must be a positive integer");
      return;
    }
    if (!editingChallenge && !formData.flag.trim()) {
      setFormError("Flag is required for new challenges");
      return;
    }

    const payload: AdminChallengeRequest = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined, // empty string lets backend generate slug from title
      description: formData.description.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      points: pts,
      flag: formData.flag.trim() || undefined,
      attachment_url: formData.attachment_url.trim() || null,
      external_link: formData.external_link.trim() || null,
      is_active: formData.is_active,
    };

    try {
      if (editingChallenge) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save challenge";
      setFormError(msg);
    }
  };

  // Filter client-side
  const filteredChallenges = challenges.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ch.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCount = challenges.filter((c) => c.is_active).length;
  const inactiveCount = challenges.length - activeCount;

  return (
    <div className="w-full space-y-8">
      {/* HEADER INDEX */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-ui pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-violet mb-1.5 uppercase tracking-wider font-bold select-none animate-pulse">
            <Shield className="h-4 w-4" />
            ADMINISTRATOR HUB // CORE TRIAL MANAGER
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            Challenges Console <span className="font-semibold text-fg-subtle">({challenges.length})</span>
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Create, update, activate, or soft-deactivate trial vector schemas for the RBLXSec public sandbox matrix.
          </p>
        </div>

        {/* Counter Stats Widget */}
        <div className="flex gap-4 p-3 bg-card-bg border border-border-ui font-mono text-[10px] select-none h-fit">
          <div>
            <span className="text-fg-subtle block font-bold">ACTIVE TARGETS</span>
            <span className="text-cyber-cyan font-bold text-xs">
              {activeCount} / {challenges.length} Online
            </span>
          </div>
          <div className="w-[1px] bg-border-ui mx-2"></div>
          <div>
            <span className="text-fg-subtle block font-bold">DEACTIVATED SCHEMA</span>
            <span className="text-cyber-amber font-bold text-xs">{inactiveCount} Standby</span>
          </div>
          <div className="w-[1px] bg-border-ui mx-2"></div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyber-violet hover:bg-cyber-violet/90 text-white rounded font-mono text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer active:scale-95 self-center"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Trial
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card-bg border border-border-ui items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Query Search */}
          <div className="relative min-w-[200px] w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter by keyword, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 pl-9 text-xs text-fg font-mono focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-fg-subtle" />
          </div>

          {/* Category Select Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {(searchQuery || selectedCategory !== "All") && (
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
            Unable to connect to administrative challenge endpoint. Check server configuration.
          </Alert>
        </div>
      )}

      {/* LOADING GRID */}
      {isLoading && (
        <div className="w-full py-16 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* ADMIN OPERATIONS TABLE */}
      {!isLoading && !error && (
        <div className="w-full overflow-x-auto border border-border-ui bg-card-bg shadow-xl">
          <table className="w-full min-w-[800px] text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-border-ui bg-bg text-fg-muted uppercase tracking-widest text-[9px]">
                <th className="p-4 w-1/3">Target Challenge Details</th>
                <th className="p-4 text-center w-32">Difficulty</th>
                <th className="p-4 text-center w-24">Points</th>
                <th className="p-4 text-center w-28">Schema Status</th>
                <th className="p-4 text-center w-40">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((ch) => (
                  <tr
                    key={ch.id}
                    className={`hover:bg-surface/50 transition-colors ${
                      !ch.is_active ? "opacity-60 bg-bg/20" : ""
                    }`}
                  >
                    {/* Trial Meta */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-fg hover:text-cyber-cyan transition-colors text-xs">
                          {ch.title}
                        </span>
                        <CategoryBadge category={ch.category as any} />
                      </div>
                      <div className="text-[10px] text-fg-subtle font-mono tracking-tighter truncate max-w-md">
                        slug: <span className="text-fg-muted">{ch.slug}</span>
                      </div>
                      <p className="text-[10px] text-fg-muted font-sans line-clamp-1 max-w-xl">
                        {ch.description}
                      </p>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="p-4 text-center">
                      <div className="inline-flex justify-center w-full">
                        <DifficultyBadge difficulty={ch.difficulty as any} />
                      </div>
                    </td>

                    {/* Points Value */}
                    <td className="p-4 text-center font-bold text-cyber-cyan text-xs">
                      {ch.points}
                    </td>

                    {/* Active Toggle Status Badge */}
                    <td className="p-4 text-center select-none">
                      <span
                        onClick={() => handleToggleStatus(ch)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] rounded font-bold uppercase tracking-wider cursor-pointer select-none transition-all active:scale-95 ${
                          ch.is_active
                            ? "bg-cyber-cyan/5 border-cyber-cyan/35 text-cyber-cyan"
                            : "bg-cyber-amber/5 border-cyber-amber/35 text-cyber-amber"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ch.is_active ? "bg-cyber-cyan animate-pulse" : "bg-cyber-amber"
                          }`}
                        ></span>
                        {ch.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions Panel */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Status Switcher Icon */}
                        <button
                          onClick={() => handleToggleStatus(ch)}
                          title={ch.is_active ? "Deactivate Trial" : "Activate Trial"}
                          className={`p-1.5 border transition-all cursor-pointer ${
                            ch.is_active
                              ? "bg-surface border-border-ui hover:border-cyber-amber/40 text-fg-muted hover:text-cyber-amber"
                              : "bg-surface border-border-ui hover:border-cyber-cyan/40 text-fg-muted hover:text-cyber-cyan"
                          }`}
                        >
                          {ch.is_active ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* lightbulb Hints Icon */}
                        <button
                          type="button"
                          onClick={() => setHintManagerChallenge(ch)}
                          title="Manage Hints"
                          className="p-1.5 bg-surface border border-border-ui hover:border-cyber-cyan/40 text-fg-muted hover:text-cyber-cyan transition-all cursor-pointer"
                        >
                          <Lightbulb className="h-3.5 w-3.5 text-cyber-cyan" />
                        </button>

                        {/* Pencil Edit Icon */}
                        <button
                          onClick={() => handleOpenEdit(ch)}
                          title="Edit Target trial"
                          className="p-1.5 bg-surface border border-border-ui hover:border-cyber-cyan/40 text-fg-muted hover:text-cyber-cyan transition-all cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Trash Delete Icon */}
                        {deleteConfirmId === ch.id ? (
                          <div className="flex items-center gap-1 animate-fade-in">
                            <button
                              onClick={() => handleDelete(ch.id)}
                              className="px-2 py-1 bg-cyber-crimson hover:bg-cyber-crimson/95 text-white font-bold text-[9px] uppercase transition-all cursor-pointer"
                            >
                              YES
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-bg hover:bg-surface text-fg-muted font-bold text-[9px] uppercase transition-all cursor-pointer"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(ch.id)}
                            title="Soft Delete Challenge"
                            className="p-1.5 bg-surface border border-border-ui hover:border-cyber-crimson/40 text-fg-muted hover:text-cyber-crimson transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-fg-subtle font-mono">
                    NO ADMINISTRATIVE TRIAL VECTORS RESOLVED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE & EDITING FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md overflow-y-auto animate-fade-in select-text">
          <div className="w-full max-w-xl bg-card-bg border border-border-ui shadow-2xl relative transition-all duration-300 flex flex-col my-8">
            {/* Close Cross */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-fg-subtle hover:text-fg transition-colors p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b border-border-ui flex items-center gap-2">
              <FolderLock className="h-4.5 w-4.5 text-cyber-violet animate-pulse" />
              <span className="font-display font-light text-base tracking-widest text-fg uppercase">
                {editingChallenge ? "UPDATE TRIAL INSTANCE" : "PROVISION NEW TRIAL"}
              </span>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-grow overflow-y-auto max-h-[70vh]">
              {formError && (
                <div className="flex items-start gap-2.5 p-3 bg-cyber-crimson/5 border border-cyber-crimson/30 text-cyber-crimson font-mono text-[11px]">
                  <XCircle className="h-4 w-4 shrink-0 pt-0.5" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider">VALIDATION CONFLICT</span>
                    {formError}
                  </div>
                </div>
              )}

              {/* Title & Points Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle"
                    placeholder="e.g. SQLi Bypass 101"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                    Points *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle"
                  />
                </div>
              </div>

              {/* Slug Input */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle"
                  placeholder="e.g. sqli-bypass-101 (Leave empty to auto-generate)"
                />
              </div>

              {/* Category & Difficulty Tiers Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                    Difficulty Tier *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
                  >
                    {difficultiesList.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                    Challenge Description *
                  </label>
                  <span className="text-[8px] text-fg-subtle font-mono uppercase tracking-widest">
                    Markdown Supported
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-sans focus:outline-none transition-all resize-y placeholder:text-fg-subtle"
                  placeholder="Provide deep sandbox trials connection steps, vector endpoints, or download materials..."
                />
              </div>

              {/* Flag Field (Secure update mechanism) */}
              <div className="space-y-1 border border-border-ui p-3 bg-surface">
                <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                  Secret Flag Hash Input {editingChallenge ? "(Optional)" : "*"}
                </label>
                <input
                  type="text"
                  required={!editingChallenge}
                  value={formData.flag}
                  onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                  className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle"
                  placeholder={
                    editingChallenge
                      ? "•••••••• (Leave blank to preserve active backend flag hash)"
                      : "iet{your_trial_secret_flag}"
                  }
                />
                <p className="text-[9px] text-fg-subtle leading-relaxed font-mono">
                  {editingChallenge
                    ? "Leave this input completely blank to preserve the active challenge secret flag hash in the database."
                    : "Plaintext flag input is securely hashed prior to storage and never exposed to the public API."}
                </p>
              </div>

              {/* Material Attachment Upload Widget */}
              <AdminAttachmentUpload
                value={formData.attachment_url}
                onChange={(val) => setFormData({ ...formData, attachment_url: val })}
              />

              {/* External URL Sandbox */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-fg-subtle uppercase tracking-widest block font-bold">
                  External Link Sandbox
                </label>
                <input
                  type="url"
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle"
                  placeholder="http://domain.com:8080"
                />
              </div>

              {/* Schema Active Toggle Switch */}
              <div className="flex items-center justify-between p-3 bg-surface border border-border-ui">
                <div>
                  <span className="font-mono text-[10px] text-fg-muted block font-bold uppercase tracking-wider">
                    Publish Online Immediately
                  </span>
                  <span className="text-[9px] text-fg-subtle font-mono">
                    If deactivated, this trial remains completely hidden from all public indexes.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`px-3 py-1.5 border font-mono text-[9px] font-bold uppercase tracking-widest cursor-pointer select-none transition-all ${
                    formData.is_active
                      ? "bg-cyber-cyan/10 border-cyber-cyan/35 text-cyber-cyan"
                      : "bg-cyber-amber/10 border-cyber-amber/35 text-cyber-amber"
                  }`}
                >
                  {formData.is_active ? "Active" : "Inactive"}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-ui">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-cyber-violet text-white hover:bg-cyber-violet/90"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving Trial...
                    </span>
                  ) : editingChallenge ? (
                    "Save Changes"
                  ) : (
                    "Create Challenge"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic challenge Hint Manager Modal overlay console */}
      {hintManagerChallenge && (
        <AdminHintManager
          challengeId={hintManagerChallenge.id}
          challengeTitle={hintManagerChallenge.title}
          onClose={() => setHintManagerChallenge(null)}
        />
      )}
    </div>
  );
}
