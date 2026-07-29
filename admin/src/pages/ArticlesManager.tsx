import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { TextField, TextAreaField } from "../components/ui/Field";
import { ImageUploadField } from "../components/ui/ImageUploadField";
import { QueryError } from "../components/ui/QueryError";

interface TeamOption {
  id: string;
  name: string;
}

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_id: string | null;
  published_at: string | null;
  reading_minutes: number;
  cover_image_url: string | null;
  content: string[];
  status: "draft" | "published";
}

const blank: Omit<ArticleRow, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  author_id: null,
  published_at: new Date().toISOString().slice(0, 10),
  reading_minutes: 5,
  cover_image_url: null,
  content: [],
  status: "draft",
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function fetchArticles(): Promise<ArticleRow[]> {
  const { data, error } = await supabase!.from("articles").select("*").order("published_at", { ascending: false });
  if (error) throw error;
  return data as ArticleRow[];
}

async function fetchTeamOptions(): Promise<TeamOption[]> {
  const { data, error } = await supabase!.from("team_members").select("id, name").order("sort_order");
  if (error) throw error;
  return data as TeamOption[];
}

export function ArticlesManager() {
  const queryClient = useQueryClient();
  const { data: articles, isLoading, isError, error } = useQuery({ queryKey: ["admin-articles"], queryFn: fetchArticles });
  const { data: teamOptions } = useQuery({ queryKey: ["admin-team-options"], queryFn: fetchTeamOptions });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ArticleRow>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  }

  function startEditing(row: ArticleRow) {
    setDrafts((prev) => ({ ...prev, [row.id]: { ...row } }));
    setExpandedId(row.id);
  }

  function updateDraft<K extends keyof ArticleRow>(id: string, field: K, value: ArticleRow[K]) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function addNew() {
    const id = `new-${Date.now()}`;
    setDrafts((prev) => ({ ...prev, [id]: { ...blank, id } }));
    setExpandedId(id);
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { id: _id, ...update } = draft;
    if (id.startsWith("new-")) {
      await supabase!.from("articles").insert(update);
    } else {
      await supabase!.from("articles").update(update).eq("id", id);
    }
    setSavingId(null);
    setExpandedId(null);
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await supabase!.from("articles").delete().eq("id", id);
    refresh();
  }

  async function toggleStatus(row: ArticleRow) {
    const status = row.status === "published" ? "draft" : "published";
    await supabase!.from("articles").update({ status }).eq("id", row.id);
    refresh();
  }

  if (isError) {
    return <QueryError error={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading articles…
      </div>
    );
  }

  const newDraftIds = Object.keys(drafts).filter((id) => id.startsWith("new-"));
  const allRows = [...(articles ?? []), ...newDraftIds.map((id) => drafts[id])];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Insights</h1>
          <p className="mt-1 text-brand-gray-500">Articles shown on the Insights page. Drafts stay hidden from clients.</p>
        </div>
        <Button onClick={addNew}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add article
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
                  <p className="font-medium text-brand-navy">{draft.title || "Untitled article"}</p>
                  <p className="text-xs text-brand-gray-400">{draft.category || "no category"}</p>
                </div>
                {!isNew && (
                  <button
                    onClick={() => toggleStatus(row)}
                    className={`rounded-sm px-2.5 py-1 text-xs font-semibold ${
                      row.status === "published" ? "bg-green-100 text-green-700" : "bg-brand-gray-100 text-brand-gray-500"
                    }`}
                  >
                    {row.status}
                  </button>
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
                  <ImageUploadField
                    label="Cover image"
                    folder="articles"
                    value={draft.cover_image_url}
                    onChange={(url) => updateDraft(row.id, "cover_image_url", url)}
                    shape="wide"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`title-${row.id}`}
                      label="Title"
                      value={draft.title}
                      onChange={(e) => {
                        updateDraft(row.id, "title", e.target.value);
                        if (isNew) updateDraft(row.id, "slug", slugify(e.target.value));
                      }}
                    />
                    <TextField id={`slug-${row.id}`} label="Slug" value={draft.slug} onChange={(e) => updateDraft(row.id, "slug", e.target.value)} />
                  </div>
                  <TextAreaField id={`excerpt-${row.id}`} label="Excerpt" rows={2} value={draft.excerpt} onChange={(e) => updateDraft(row.id, "excerpt", e.target.value)} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TextField id={`category-${row.id}`} label="Category" value={draft.category} onChange={(e) => updateDraft(row.id, "category", e.target.value)} />
                    <TextField
                      id={`date-${row.id}`}
                      label="Published date"
                      type="date"
                      value={draft.published_at ?? ""}
                      onChange={(e) => updateDraft(row.id, "published_at", e.target.value)}
                    />
                    <TextField
                      id={`reading-${row.id}`}
                      label="Reading minutes"
                      type="number"
                      value={draft.reading_minutes}
                      onChange={(e) => updateDraft(row.id, "reading_minutes", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label htmlFor={`author-${row.id}`} className="block text-sm font-medium text-brand-navy">
                      Author
                    </label>
                    <select
                      id={`author-${row.id}`}
                      className="mt-1.5 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
                      value={draft.author_id ?? ""}
                      onChange={(e) => updateDraft(row.id, "author_id", e.target.value || null)}
                    >
                      <option value="">— Select author —</option>
                      {(teamOptions ?? []).map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <TextAreaField
                    id={`content-${row.id}`}
                    label="Body (one paragraph per line)"
                    rows={8}
                    value={draft.content.join("\n")}
                    onChange={(e) => updateDraft(row.id, "content", e.target.value.split("\n").filter(Boolean))}
                  />

                  <div>
                    <label htmlFor={`status-${row.id}`} className="block text-sm font-medium text-brand-navy">
                      Status
                    </label>
                    <select
                      id={`status-${row.id}`}
                      className="mt-1.5 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
                      value={draft.status}
                      onChange={(e) => updateDraft(row.id, "status", e.target.value as "draft" | "published")}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <Button onClick={() => handleSave(row.id)} disabled={savingId === row.id}>
                    {savingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    {isNew ? "Create article" : "Save changes"}
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
