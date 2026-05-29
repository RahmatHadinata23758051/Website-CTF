import React from "react";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Loader2,
  AlertCircle,
  FolderKey,
} from "lucide-react";
import {
  useAdminHints,
  useCreateHint,
  useUpdateHint,
  useUpdateHintStatus,
  useDeleteHint,
} from "../../features/challenges/hintsHooks";
import type { Hint, AdminHintRequest } from "../../features/challenges/hintsTypes";
import { Button } from "../ui/Button";

interface AdminHintManagerProps {
  challengeId: string;
  challengeTitle: string;
  onClose: () => void;
}

interface FormState {
  content: string;
  cost: string;
  order_index: string;
  is_active: boolean;
}

const initialFormState: FormState = {
  content: "",
  cost: "0",
  order_index: "1",
  is_active: true,
};

export function AdminHintManager({ challengeId, challengeTitle, onClose }: AdminHintManagerProps) {
  const { data: hints = [], isLoading, error } = useAdminHints(challengeId);

  const createMutation = useCreateHint(challengeId);
  const updateMutation = useUpdateHint(challengeId);
  const updateStatusMutation = useUpdateHintStatus(challengeId);
  const deleteMutation = useDeleteHint(challengeId);

  // Form states
  const [formData, setFormData] = React.useState<FormState>(initialFormState);
  const [editingHint, setEditingHint] = React.useState<Hint | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Switch to edit mode
  const handleEditInit = (hint: Hint) => {
    setEditingHint(hint);
    setFormData({
      content: hint.content,
      cost: hint.cost.toString(),
      order_index: hint.order_index.toString(),
      is_active: hint.is_active,
    });
    setFormError(null);
  };

  // Reset form / exit edit mode
  const handleCancelForm = () => {
    setEditingHint(null);
    setFormData(initialFormState);
    setFormError(null);
  };

  // Toggle active status
  const handleToggleStatus = async (hint: Hint) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: hint.id,
        isActive: !hint.is_active,
      });
    } catch (err: any) {
      // Ignore / handle gracefully
    }
  };

  // Delete hint
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
      if (editingHint?.id === id) {
        handleCancelForm();
      }
    } catch {
      // Ignore
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.content.trim()) {
      setFormError("Hint content is required");
      return;
    }
    const costInt = parseInt(formData.cost, 10);
    const orderInt = parseInt(formData.order_index, 10);
    if (isNaN(costInt) || costInt < 0) {
      setFormError("Cost must be a positive integer or zero");
      return;
    }
    if (isNaN(orderInt) || orderInt < 0) {
      setFormError("Order index must be a positive integer or zero");
      return;
    }

    const payload: AdminHintRequest = {
      content: formData.content.trim(),
      cost: costInt,
      order_index: orderInt,
      is_active: formData.is_active,
    };

    try {
      if (editingHint) {
        await updateMutation.mutateAsync({
          id: editingHint.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleCancelForm();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save hint";
      setFormError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in select-text">
      <div className="w-full max-w-2xl bg-[#090909] border border-slate-800 shadow-2xl relative transition-all duration-300 flex flex-col my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-200 transition-colors p-1 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-slate-855 flex items-center gap-2">
          <FolderKey className="h-4.5 w-4.5 text-cyber-cyan animate-pulse" />
          <div className="text-left font-mono">
            <span className="font-display font-light text-sm tracking-widest text-slate-50 uppercase block">
              Trial Hint Management console
            </span>
            <span className="text-[10px] text-slate-500 font-bold block uppercase -mt-0.5">
              TARGET: <span className="text-cyber-cyan">{challengeTitle}</span>
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-850 flex-grow max-h-[70vh] overflow-y-auto">
          {/* Left Panel: Hint List (7 cols) */}
          <div className="md:col-span-7 p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between font-mono text-[9px] text-slate-550 uppercase tracking-widest block font-bold select-none border-b border-slate-850 pb-2">
              <span>Active Hint Vectors ({hints.length})</span>
              <span>Sorted: order_index ASC</span>
            </div>

            {isLoading && (
              <div className="py-12 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-cyber-cyan animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-2 bg-cyber-crimson/5 border border-cyber-crimson/25 text-cyber-crimson font-mono text-[10px] rounded">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Failed to synchronize active hints catalog.</span>
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-2">
                {hints.length > 0 ? (
                  hints.map((hint) => (
                    <div
                      key={hint.id}
                      className={`p-3 border font-mono text-[11px] flex flex-col justify-between gap-2.5 transition-all ${
                        editingHint?.id === hint.id
                          ? "border-cyber-cyan bg-cyber-cyan/5"
                          : hint.is_active
                          ? "border-slate-850 bg-slate-950/20 hover:border-slate-800"
                          : "border-slate-850 bg-slate-950/10 opacity-50"
                      }`}
                    >
                      <div className="text-left space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] select-none">
                          <span className="font-bold text-slate-400">ORDER INDEX: {hint.order_index}</span>
                          <span className="text-slate-500">(Cost: {hint.cost} PTS)</span>
                        </div>
                        <p className="font-sans text-slate-200 leading-normal text-xs">{hint.content}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-t border-slate-850/60 pt-2 text-[10px] select-none">
                        <span
                          onClick={() => handleToggleStatus(hint)}
                          className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest cursor-pointer ${
                            hint.is_active ? "text-cyber-cyan" : "text-cyber-amber"
                          }`}
                        >
                          {hint.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {hint.is_active ? "Active" : "Inactive"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditInit(hint)}
                            className="p-1 bg-slate-900 border border-slate-800 hover:border-cyber-cyan/40 text-slate-400 hover:text-cyber-cyan transition-all cursor-pointer"
                            title="Edit Hint"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>

                          {deleteConfirmId === hint.id ? (
                            <div className="flex items-center gap-1 animate-fade-in text-[8px]">
                              <button
                                type="button"
                                onClick={() => handleDelete(hint.id)}
                                className="px-1.5 py-0.5 bg-cyber-crimson hover:bg-cyber-crimson/95 text-white font-bold uppercase transition-all cursor-pointer"
                              >
                                YES
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold uppercase transition-all cursor-pointer"
                              >
                                NO
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(hint.id)}
                              className="p-1 bg-slate-900 border border-slate-800 hover:border-cyber-crimson/40 text-slate-400 hover:text-cyber-crimson transition-all cursor-pointer"
                              title="Delete Hint"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-600 border border-dashed border-slate-850 p-4 font-mono text-xs">
                    NO ACTIVE GUIDANCE INSTANCES PROVISIONED
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Form Creator (5 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-5 p-6 space-y-4 text-left">
            <div className="font-mono text-[9px] text-slate-550 uppercase tracking-widest block font-bold select-none border-b border-slate-850 pb-2">
              <span>{editingHint ? "Edit Hint Mode" : "Provision New Hint"}</span>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-2 bg-cyber-crimson/5 border border-cyber-crimson/25 text-cyber-crimson font-mono text-[10px] rounded animate-slide-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Hint Content Textarea */}
            <div className="space-y-1">
              <label className="font-mono text-[9px] text-slate-550 uppercase tracking-widest block font-bold">
                Hint Content *
              </label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-cyber-cyan rounded p-2 text-xs text-slate-100 font-sans focus:outline-none transition-all resize-none"
                placeholder="Check configuration variables, bypass parameter routines..."
              />
            </div>

            {/* Order index & cost */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-550 uppercase tracking-widest block font-bold">
                  Order Index *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-cyber-cyan rounded p-2 text-xs text-slate-100 font-mono focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-slate-550 uppercase tracking-widest block font-bold">
                  Points Cost *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-cyber-cyan rounded p-2 text-xs text-slate-100 font-mono focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Schema Active Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 text-[10px]">
              <div>
                <span className="font-mono text-[9px] text-slate-350 block font-bold uppercase tracking-wider">
                  Is Active
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`px-2 py-1.5 border font-mono text-[8px] font-bold uppercase tracking-widest cursor-pointer select-none transition-all ${
                  formData.is_active
                    ? "bg-cyber-cyan/10 border-cyber-cyan/35 text-cyber-cyan"
                    : "bg-cyber-amber/10 border-cyber-amber/35 text-cyber-amber"
                }`}
              >
                {formData.is_active ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Actions panel */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850/60">
              {editingHint && (
                <Button type="button" variant="secondary" onClick={handleCancelForm} className="py-1 px-3">
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-cyber-cyan text-slate-950 font-bold hover:opacity-90 py-1 px-3"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </span>
                ) : editingHint ? (
                  "Save"
                ) : (
                  "Add Hint"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
