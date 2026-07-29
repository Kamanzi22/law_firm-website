import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { TextField, TextAreaField } from "../components/ui/Field";
import { ImageUploadField } from "../components/ui/ImageUploadField";

interface ServiceOption {
  slug: string;
  name: string;
}

interface TeamRow {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string;
  focus_area_slugs: string[];
  education: string[];
  email: string | null;
  is_active: boolean;
  sort_order: number;
}

const blankMember: Omit<TeamRow, "id"> = {
  slug: "",
  name: "",
  role: "",
  photo_url: null,
  bio: "",
  focus_area_slugs: [],
  education: [],
  email: "",
  is_active: true,
  sort_order: 0,
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function fetchTeam(): Promise<TeamRow[]> {
  const { data, error } = await supabase!.from("team_members").select("*").order("sort_order");
  if (error) throw error;
  return data as TeamRow[];
}

async function fetchServiceOptions(): Promise<ServiceOption[]> {
  const { data, error } = await supabase!.from("services").select("slug, name").order("sort_order");
  if (error) throw error;
  return data as ServiceOption[];
}

export function TeamManager() {
  const queryClient = useQueryClient();
  const { data: team, isLoading } = useQuery({ queryKey: ["admin-team"], queryFn: fetchTeam });
  const { data: serviceOptions } = useQuery({ queryKey: ["admin-service-options"], queryFn: fetchServiceOptions });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, TeamRow>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    queryClient.invalidateQueries({ queryKey: ["team"] });
  }

  function startEditing(member: TeamRow) {
    setDrafts((prev) => ({ ...prev, [member.id]: { ...member } }));
    setExpandedId(member.id);
  }

  function updateDraft<K extends keyof TeamRow>(id: string, field: K, value: TeamRow[K]) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function toggleFocusArea(id: string, slug: string) {
    setDrafts((prev) => {
      const draft = prev[id];
      const has = draft.focus_area_slugs.includes(slug);
      const focus_area_slugs = has
        ? draft.focus_area_slugs.filter((s) => s !== slug)
        : [...draft.focus_area_slugs, slug];
      return { ...prev, [id]: { ...draft, focus_area_slugs } };
    });
  }

  function addNew() {
    const id = `new-${Date.now()}`;
    const sort_order = (team?.length ?? 0) + 1;
    setDrafts((prev) => ({ ...prev, [id]: { ...blankMember, id, sort_order } }));
    setExpandedId(id);
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { id: _id, ...update } = draft;
    if (id.startsWith("new-")) {
      await supabase!.from("team_members").insert(update);
    } else {
      await supabase!.from("team_members").update(update).eq("id", id);
    }
    setSavingId(null);
    setExpandedId(null);
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member? This cannot be undone.")) return;
    await supabase!.from("team_members").delete().eq("id", id);
    refresh();
  }

  async function toggleActive(member: TeamRow) {
    await supabase!.from("team_members").update({ is_active: !member.is_active }).eq("id", member.id);
    refresh();
  }

  async function moveOrder(member: TeamRow, direction: -1 | 1) {
    if (!team) return;
    const sorted = [...team].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((m) => m.id === member.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];
    await Promise.all([
      supabase!.from("team_members").update({ sort_order: other.sort_order }).eq("id", member.id),
      supabase!.from("team_members").update({ sort_order: member.sort_order }).eq("id", other.id),
    ]);
    refresh();
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading team…
      </div>
    );
  }

  const newDraftIds = Object.keys(drafts).filter((id) => id.startsWith("new-"));
  const allRows = [...(team ?? []), ...newDraftIds.map((id) => drafts[id])];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Team</h1>
          <p className="mt-1 text-brand-gray-500">Attorneys and staff shown on the About page.</p>
        </div>
        <Button onClick={addNew}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add team member
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {allRows.map((member) => {
          const isExpanded = expandedId === member.id;
          const draft = drafts[member.id] ?? member;
          const isNew = member.id.startsWith("new-");

          return (
            <div key={member.id} className="rounded-sm border border-brand-gray-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3">
                {draft.photo_url ? (
                  <img src={draft.photo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-gray-100" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-brand-navy">{draft.name || "Untitled member"}</p>
                  <p className="text-xs text-brand-gray-400">{draft.role || "no role"}</p>
                </div>
                {!isNew && (
                  <>
                    <button onClick={() => moveOrder(member, -1)} aria-label="Move up" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => moveOrder(member, 1)} aria-label="Move down" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <label className="flex items-center gap-1.5 text-xs text-brand-gray-500">
                      <input type="checkbox" checked={member.is_active} onChange={() => toggleActive(member)} />
                      Active
                    </label>
                  </>
                )}
                <Button variant="ghost" onClick={() => (isExpanded ? setExpandedId(null) : startEditing(member))}>
                  {isExpanded ? "Close" : "Edit"}
                </Button>
                {!isNew && (
                  <button onClick={() => handleDelete(member.id)} aria-label="Delete" className="rounded p-1.5 text-brand-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t border-brand-gray-200 p-4">
                  <ImageUploadField
                    label="Photo"
                    folder="team"
                    value={draft.photo_url}
                    onChange={(url) => updateDraft(member.id, "photo_url", url)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`name-${member.id}`}
                      label="Name"
                      value={draft.name}
                      onChange={(e) => {
                        updateDraft(member.id, "name", e.target.value);
                        if (isNew) updateDraft(member.id, "slug", slugify(e.target.value));
                      }}
                    />
                    <TextField id={`slug-${member.id}`} label="Slug" value={draft.slug} onChange={(e) => updateDraft(member.id, "slug", e.target.value)} />
                  </div>
                  <TextField id={`role-${member.id}`} label="Role / title" value={draft.role} onChange={(e) => updateDraft(member.id, "role", e.target.value)} />
                  <TextAreaField id={`bio-${member.id}`} label="Bio" rows={4} value={draft.bio} onChange={(e) => updateDraft(member.id, "bio", e.target.value)} />
                  <TextField id={`email-${member.id}`} label="Email" type="email" value={draft.email ?? ""} onChange={(e) => updateDraft(member.id, "email", e.target.value)} />
                  <TextAreaField
                    id={`education-${member.id}`}
                    label="Education (one per line)"
                    rows={3}
                    value={draft.education.join("\n")}
                    onChange={(e) => updateDraft(member.id, "education", e.target.value.split("\n").filter(Boolean))}
                  />

                  <div>
                    <span className="block text-sm font-medium text-brand-navy">Focus areas</span>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {(serviceOptions ?? []).map((option) => (
                        <label key={option.slug} className="flex items-center gap-1.5 text-sm text-brand-gray-600">
                          <input
                            type="checkbox"
                            checked={draft.focus_area_slugs.includes(option.slug)}
                            onChange={() => toggleFocusArea(member.id, option.slug)}
                          />
                          {option.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => handleSave(member.id)} disabled={savingId === member.id}>
                    {savingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    {isNew ? "Create team member" : "Save changes"}
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
