// components/Home/Cases.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type PersonAddress = { street?: string; suburb?: string; postalCode?: string };
type Complainant = {
  type?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  email?: string;
  physical?: PersonAddress;
};
type Respondent = {
  title?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  email?: string;
  physical?: PersonAddress;
};
type Property = { address?: string; type?: string };
type Complaint = { type?: string; details?: string };

type ComplaintRow = {
  id: string;
  created_at: string;
  status: string;
  reference?: string | null;
  complainant: Complainant;
  respondent: Respondent;
  property: Property;
  complaint: Complaint;
};

function fmtDate(d?: string) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}
function fmtDateTime(d?: string) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}
function addressLine(a?: PersonAddress) {
  if (!a) return "";
  const parts = [a.street, a.suburb, a.postalCode].filter(Boolean);
  return parts.join(", ");
}
function nameOf(p?: { title?: string; firstName?: string; lastName?: string }) {
  if (!p) return "";
  return [p.title, p.firstName, p.lastName].filter(Boolean).join(" ");
}

const statusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "under review":
      return "bg-amber-100 text-amber-700";
    case "scheduled":
      return "bg-indigo-100 text-indigo-700";
    case "resolved":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function CasesTable({ filters }: { filters: any }) {
  const supabase = supabaseBrowser;
  const [rows, setRows] = useState<ComplaintRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [openRow, setOpenRow] = useState<ComplaintRow | null>(null);

  const total = useMemo(() => rows.length, [rows]);
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        let query = supabase
          .from("complaints")
          .select(
            `
              id,
              created_at,
              status,
              reference,
              complainant,
              respondent,
              property,
              complaint
            `
          )
          .order("created_at", { ascending: false });

        if (filters.status && filters.status !== "All Statuses") {
          query = query.eq("status", filters.status);
        }
        if (filters.type && filters.type !== "All Types") {
          query = query.contains("complaint", { type: filters.type });
        }
        if (filters.start) {
          query = query.gte("created_at", new Date(filters.start).toISOString());
        }
        if (filters.end) {
          const endDate = new Date(filters.end);
          endDate.setDate(endDate.getDate() + 1);
          query = query.lt("created_at", endDate.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        if (!active) return;

        setRows((data ?? []) as unknown as ComplaintRow[]);
      } catch (e: any) {
        setErr(e?.message || "Failed to load cases");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <div className="bg-white text-black rounded-md shadow px-6 py-6">
      <h2 className="text-lg font-semibold mb-4">Cases</h2>

      {err && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-b-gray-200">
              <th className="py-3">CASE ID</th>
              <th>REFERENCE</th>
              <th>COMPLAINANT</th>
              <th>COMPLAINT TYPE</th>
              <th>STATUS</th>
              <th>SUBMITTED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-6 text-sm text-gray-500" colSpan={7}>
                  Loading…
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-gray-500" colSpan={7}>
                  No cases found.
                </td>
              </tr>
            ) : (
              paged.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-b-gray-200 text-sm hover:bg-gray-50 transition"
                >
                  <td className="py-5">{c.id}</td>
                  <td>{c.reference ?? "—"}</td>
                  <td>{nameOf(c.complainant)}</td>
                  <td>{c.complaint?.type || "—"}</td>
                  <td>
                    <span
                      className={`px-2 rounded-md text-xs font-medium ${statusBadge(
                        c.status || ""
                      )}`}
                    >
                      {c.status || "—"}
                    </span>
                  </td>
                  <td>{fmtDate(c.created_at)}</td>
                  <td className="flex gap-2 py-5">
                    <button
                      onClick={() => setOpenRow(c)}
                      className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      VIEW
                    </button>
                    <button className="px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-md hover:opacity-90">
                      UPDATE STATUS
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded-md disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          {[...Array(Math.max(1, Math.ceil(total / pageSize)))].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, Math.ceil(total / pageSize)))
            }
            className="px-2 py-1 border rounded-md disabled:opacity-50"
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Next
          </button>
        </div>
      </div>

      {openRow && <CaseModal row={openRow} onClose={() => setOpenRow(null)} />}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="font-semibold text-slate-800 mb-2">{title}</div>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function CaseModal({
  row,
  onClose,
}: {
  row: ComplaintRow;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="text-lg font-semibold text-slate-900">
            Case Details
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card title="Complainant Information">
              <div>
                <div>
                  <span className="font-semibold">Type:</span>{" "}
                  {row.complainant?.type || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Name:</span>{" "}
                  {nameOf(row.complainant)}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">ID:</span>{" "}
                  {row.complainant?.idNumber || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Email:</span>{" "}
                  {row.complainant?.email || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Address:</span>{" "}
                  {addressLine(row.complainant?.physical) || "—"}
                </div>
              </div>
            </Card>

            <Card title="Respondent Information">
              <div>
                <div className="mt-1">
                  <span className="font-semibold">Name:</span>{" "}
                  {nameOf(row.respondent)}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">ID:</span>{" "}
                  {row.respondent?.idNumber || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Email:</span>{" "}
                  {row.respondent?.email || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Address:</span>{" "}
                  {addressLine(row.respondent?.physical) || "—"}
                </div>
              </div>
            </Card>

            <Card title="Property Information">
              <div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {row.property?.address || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Type:</span>{" "}
                  {row.property?.type || "—"}
                </div>
              </div>
            </Card>

            <Card title="Complaint Information">
              <div>
                <div>
                  <span className="font-semibold">Type:</span>{" "}
                  {row.complaint?.type || "—"}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 rounded-md text-xs font-medium ${statusBadge(
                      row.status || ""
                    )}`}
                  >
                    {row.status || "—"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card title="Case Meta">
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">Case ID:</span> {row.id}
                </div>
                <div>
                  <span className="font-semibold">Reference:</span>{" "}
                  {row.reference || "—"}
                </div>
                <div>
                  <span className="font-semibold">Submission Date:</span>{" "}
                  {fmtDateTime(row.created_at)}
                </div>
              </div>
            </Card>

            <Card title="Complaint Details">
              <div className="whitespace-pre-wrap">
                {row.complaint?.details || "—"}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
