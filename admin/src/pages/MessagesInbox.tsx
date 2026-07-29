import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "../components/ui/QueryError";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

const STATUS_OPTIONS: MessageRow["status"][] = ["new", "read", "replied"];

const statusColors: Record<MessageRow["status"], string> = {
  new: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  replied: "bg-green-100 text-green-700",
};

async function fetchMessages(): Promise<MessageRow[]> {
  const { data, error } = await supabase!.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as MessageRow[];
}

export function MessagesInbox() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading, isError, error } = useQuery({ queryKey: ["admin-messages"], queryFn: fetchMessages });

  async function updateStatus(id: string, status: MessageRow["status"]) {
    await supabase!.from("contact_messages").update({ status }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-counts"] });
  }

  if (isError) {
    return <QueryError error={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading messages…
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-navy">Messages</h1>
      <p className="mt-1 text-brand-gray-500">Submissions from the Contact page.</p>

      <div className="mt-6 space-y-3">
        {(messages ?? []).length === 0 && <p className="text-brand-gray-400">No messages yet.</p>}
        {(messages ?? []).map((msg) => (
          <div key={msg.id} className="rounded-sm border border-brand-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-brand-navy">{msg.subject}</p>
                <p className="text-xs text-brand-gray-400">
                  {msg.name} · {msg.email} · {msg.phone} · {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
              <select
                value={msg.status}
                onChange={(e) => updateStatus(msg.id, e.target.value as MessageRow["status"])}
                className={`rounded-sm px-2.5 py-1 text-xs font-semibold ${statusColors[msg.status]}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 rounded-sm bg-brand-gray-50 p-3 text-sm text-brand-gray-600">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
