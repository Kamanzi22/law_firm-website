import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { TextField, TextAreaField } from "../components/ui/Field";
import { QueryError } from "../components/ui/QueryError";

interface TestimonialRow {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  is_active: boolean;
  sort_order: number;
}

const blank: Omit<TestimonialRow, "id"> = {
  quote: "",
  author: "",
  role: "",
  company: "",
  is_active: true,
  sort_order: 0,
};

async function fetchTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase!.from("testimonials").select("*").order("sort_order");
  if (error) throw error;
  return data as TestimonialRow[];
}

export function TestimonialsManager() {
  const queryClient = useQueryClient();
  const { data: testimonials, isLoading, isError, error } = useQuery({ queryKey: ["admin-testimonials"], queryFn: fetchTestimonials });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, TestimonialRow>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });
  }

  function startEditing(row: TestimonialRow) {
    setDrafts((prev) => ({ ...prev, [row.id]: { ...row } }));
    setExpandedId(row.id);
  }

  function updateDraft<K extends keyof TestimonialRow>(id: string, field: K, value: TestimonialRow[K]) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function addNew() {
    const id = `new-${Date.now()}`;
    const sort_order = (testimonials?.length ?? 0) + 1;
    setDrafts((prev) => ({ ...prev, [id]: { ...blank, id, sort_order } }));
    setExpandedId(id);
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { id: _id, ...update } = draft;
    if (id.startsWith("new-")) {
      await supabase!.from("testimonials").insert(update);
    } else {
      await supabase!.from("testimonials").update(update).eq("id", id);
    }
    setSavingId(null);
    setExpandedId(null);
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await supabase!.from("testimonials").delete().eq("id", id);
    refresh();
  }

  async function toggleActive(row: TestimonialRow) {
    await supabase!.from("testimonials").update({ is_active: !row.is_active }).eq("id", row.id);
    refresh();
  }

  async function moveOrder(row: TestimonialRow, direction: -1 | 1) {
    if (!testimonials) return;
    const sorted = [...testimonials].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((t) => t.id === row.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];
    await Promise.all([
      supabase!.from("testimonials").update({ sort_order: other.sort_order }).eq("id", row.id),
      supabase!.from("testimonials").update({ sort_order: row.sort_order }).eq("id", other.id),
    ]);
    refresh();
  }

  if (isError) {
    return <QueryError error={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading testimonials…
      </div>
    );
  }

  const newDraftIds = Object.keys(drafts).filter((id) => id.startsWith("new-"));
  const allRows = [...(testimonials ?? []), ...newDraftIds.map((id) => drafts[id])];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Testimonials</h1>
          <p className="mt-1 text-brand-gray-500">Client quotes shown on the homepage.</p>
        </div>
        <Button onClick={addNew}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add testimonial
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {allRows.map((row) => {
          const isExpanded = expandedId === row.id;
          const draft = drafts[row.id] ?? row;
          const isNew = row.id.startsWith("new-");

          return (
            <div key={row.id} className="rounded-sm border border-brand-gray-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <p className="font-medium text-brand-navy">{draft.author || "Untitled"}</p>
                  <p className="truncate text-xs text-brand-gray-400">{draft.quote || "No quote yet"}</p>
                </div>
                {!isNew && (
                  <>
                    <button onClick={() => moveOrder(row, -1)} aria-label="Move up" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => moveOrder(row, 1)} aria-label="Move down" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <label className="flex items-center gap-1.5 text-xs text-brand-gray-500">
                      <input type="checkbox" checked={row.is_active} onChange={() => toggleActive(row)} />
                      Active
                    </label>
                  </>
                )}
                <Button variant="ghost" onClick={() => (isExpanded ? setExpandedId(null) : startEditing(row))}>
                  {isExpanded ? "Close" : "Edit"}
                </Button>
                {!isNew && (
                  <button onClick={() => handleDelete(row.id)} aria-label="Delete" className="rounded p-1.5 text-brand-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t border-brand-gray-200 p-4">
                  <TextAreaField id={`quote-${row.id}`} label="Quote" rows={3} value={draft.quote} onChange={(e) => updateDraft(row.id, "quote", e.target.value)} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TextField id={`author-${row.id}`} label="Author name" value={draft.author} onChange={(e) => updateDraft(row.id, "author", e.target.value)} />
                    <TextField id={`role-${row.id}`} label="Role" value={draft.role} onChange={(e) => updateDraft(row.id, "role", e.target.value)} />
                    <TextField id={`company-${row.id}`} label="Company" value={draft.company} onChange={(e) => updateDraft(row.id, "company", e.target.value)} />
                  </div>
                  <Button onClick={() => handleSave(row.id)} disabled={savingId === row.id}>
                    {savingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    {isNew ? "Create testimonial" : "Save changes"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
