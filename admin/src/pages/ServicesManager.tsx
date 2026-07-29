import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, GripVertical } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { TextField, TextAreaField } from "../components/ui/Field";

interface ProcessStep {
  title: string;
  description: string;
}

interface ServiceRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  overview: string;
  help_with: string[];
  process: ProcessStep[];
  icon: string;
  is_active: boolean;
  sort_order: number;
}

const ICONS = ["briefcase", "gavel", "users", "building", "landmark", "lightbulb"];

const blankService: Omit<ServiceRow, "id"> = {
  slug: "",
  name: "",
  short_description: "",
  overview: "",
  help_with: [],
  process: [],
  icon: "briefcase",
  is_active: true,
  sort_order: 0,
};

async function fetchServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase!.from("services").select("*").order("sort_order");
  if (error) throw error;
  return data as ServiceRow[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServicesManager() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({ queryKey: ["admin-services"], queryFn: fetchServices });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ServiceRow>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

  function startEditing(service: ServiceRow) {
    setDrafts((prev) => ({ ...prev, [service.id]: { ...service } }));
    setExpandedId(service.id);
  }

  function updateDraft<K extends keyof ServiceRow>(id: string, field: K, value: ServiceRow[K]) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function updateStep(id: string, index: number, field: keyof ProcessStep, value: string) {
    setDrafts((prev) => {
      const draft = prev[id];
      const process = draft.process.map((step, i) => (i === index ? { ...step, [field]: value } : step));
      return { ...prev, [id]: { ...draft, process } };
    });
  }

  function addStep(id: string) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], process: [...prev[id].process, { title: "", description: "" }] },
    }));
  }

  function removeStep(id: string, index: number) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], process: prev[id].process.filter((_, i) => i !== index) },
    }));
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { id: _id, ...update } = draft;
    if (id.startsWith("new-")) {
      await supabase!.from("services").insert(update);
    } else {
      await supabase!.from("services").update(update).eq("id", id);
    }
    setSavingId(null);
    setExpandedId(null);
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    await supabase!.from("services").delete().eq("id", id);
    refresh();
  }

  async function toggleActive(service: ServiceRow) {
    await supabase!.from("services").update({ is_active: !service.is_active }).eq("id", service.id);
    refresh();
  }

  async function moveOrder(service: ServiceRow, direction: -1 | 1) {
    if (!services) return;
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((s) => s.id === service.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];
    await Promise.all([
      supabase!.from("services").update({ sort_order: other.sort_order }).eq("id", service.id),
      supabase!.from("services").update({ sort_order: service.sort_order }).eq("id", other.id),
    ]);
    refresh();
  }

  function addNew() {
    const id = `new-${Date.now()}`;
    const sort_order = (services?.length ?? 0) + 1;
    setDrafts((prev) => ({ ...prev, [id]: { ...blankService, id, sort_order } }));
    setExpandedId(id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading services…
      </div>
    );
  }

  const newDraftIds = Object.keys(drafts).filter((id) => id.startsWith("new-"));
  const allRows = [...(services ?? []), ...newDraftIds.map((id) => drafts[id])];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Services</h1>
          <p className="mt-1 text-brand-gray-500">Practice areas shown on the site. Toggle to hide without deleting.</p>
        </div>
        <Button onClick={addNew}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add service
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {allRows.map((service) => {
          const isExpanded = expandedId === service.id;
          const draft = drafts[service.id] ?? service;
          const isNew = service.id.startsWith("new-");

          return (
            <div key={service.id} className="rounded-sm border border-brand-gray-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="h-4 w-4 text-brand-gray-300" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-brand-navy">{draft.name || "Untitled service"}</p>
                  <p className="text-xs text-brand-gray-400">{draft.slug || "no-slug"}</p>
                </div>
                {!isNew && (
                  <>
                    <button onClick={() => moveOrder(service, -1)} aria-label="Move up" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => moveOrder(service, 1)} aria-label="Move down" className="rounded p-1.5 text-brand-gray-400 hover:bg-brand-gray-100">
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <label className="flex items-center gap-1.5 text-xs text-brand-gray-500">
                      <input type="checkbox" checked={service.is_active} onChange={() => toggleActive(service)} />
                      Active
                    </label>
                  </>
                )}
                <Button variant="ghost" onClick={() => (isExpanded ? setExpandedId(null) : startEditing(service))}>
                  {isExpanded ? "Close" : "Edit"}
                </Button>
                {!isNew && (
                  <button onClick={() => handleDelete(service.id)} aria-label="Delete" className="rounded p-1.5 text-brand-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t border-brand-gray-200 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`name-${service.id}`}
                      label="Name"
                      value={draft.name}
                      onChange={(e) => {
                        updateDraft(service.id, "name", e.target.value);
                        if (isNew) updateDraft(service.id, "slug", slugify(e.target.value));
                      }}
                    />
                    <TextField id={`slug-${service.id}`} label="Slug" value={draft.slug} onChange={(e) => updateDraft(service.id, "slug", e.target.value)} />
                  </div>
                  <TextField
                    id={`short-${service.id}`}
                    label="Short description (cards)"
                    value={draft.short_description}
                    onChange={(e) => updateDraft(service.id, "short_description", e.target.value)}
                  />
                  <TextAreaField
                    id={`overview-${service.id}`}
                    label="Overview (detail page)"
                    rows={3}
                    value={draft.overview}
                    onChange={(e) => updateDraft(service.id, "overview", e.target.value)}
                  />
                  <TextAreaField
                    id={`help-${service.id}`}
                    label="What we help with (one per line)"
                    rows={4}
                    value={draft.help_with.join("\n")}
                    onChange={(e) => updateDraft(service.id, "help_with", e.target.value.split("\n").filter(Boolean))}
                  />

                  <div>
                    <span className="block text-sm font-medium text-brand-navy">Process steps</span>
                    <div className="mt-2 space-y-2">
                      {draft.process.map((step, index) => (
                        <div key={index} className="flex gap-2 rounded-sm border border-brand-gray-200 p-2">
                          <div className="flex-1 space-y-1.5">
                            <input
                              className="w-full rounded-sm border border-brand-gray-300 px-2 py-1.5 text-sm"
                              placeholder="Step title"
                              value={step.title}
                              onChange={(e) => updateStep(service.id, index, "title", e.target.value)}
                            />
                            <input
                              className="w-full rounded-sm border border-brand-gray-300 px-2 py-1.5 text-sm"
                              placeholder="Step description"
                              value={step.description}
                              onChange={(e) => updateStep(service.id, index, "description", e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            aria-label="Remove step"
                            onClick={() => removeStep(service.id, index)}
                            className="self-start rounded p-1.5 text-brand-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="mt-2" onClick={() => addStep(service.id)}>
                      <Plus className="h-4 w-4" aria-hidden="true" /> Add step
                    </Button>
                  </div>

                  <div>
                    <label htmlFor={`icon-${service.id}`} className="block text-sm font-medium text-brand-navy">
                      Icon
                    </label>
                    <select
                      id={`icon-${service.id}`}
                      className="mt-1.5 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
                      value={draft.icon}
                      onChange={(e) => updateDraft(service.id, "icon", e.target.value)}
                    >
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button onClick={() => handleSave(service.id)} disabled={savingId === service.id}>
                    {savingId === service.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                    {isNew ? "Create service" : "Save changes"}
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
