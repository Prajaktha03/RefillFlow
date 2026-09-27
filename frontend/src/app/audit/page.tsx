"use client";

import { useEffect, useState } from "react";
import { getAudit, getCases } from "@/services/api";

type RefillCase = {
  id: number;
  case_id: string;
  patient_name: string;
  medication: string;
  status: string;
};

export default function AuditPage() {
  const [cases, setCases] = useState<RefillCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("RF-001");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const allCases = await getCases();
        setCases(allCases);
        if (allCases.length > 0) {
          // Check query params if any
          const searchParams = new URLSearchParams(window.location.search);
          const paramId = searchParams.get("case_id");
          const targetId = paramId && allCases.some((c: RefillCase) => c.case_id === paramId)
            ? paramId
            : allCases[0].case_id;
          setSelectedCaseId(targetId);
        }
      } catch (err) {
        console.error("Error loading cases for audit:", err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      loadAudit(selectedCaseId);
    }
  }, [selectedCaseId]);

  async function loadAudit(caseId: string) {
    try {
      setLoading(true);
      const data = await getAudit(caseId);
      setEvents(data);
    } catch (err) {
      console.error("Error loading audit timeline:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  const currentCase = cases.find((c) => c.case_id === selectedCaseId);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Activity Log
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white">
              Audit Timeline
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Complete HIPAA-compliant event history for refill cases.
            </p>
          </div>

          {/* Case Selector Dropdown */}
          {cases.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Select Refill Case
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-cyan-300 outline-none focus:border-cyan-400"
              >
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_id} — {c.patient_name} ({c.medication})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Case Info Header */}
        {currentCase && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-6 py-4">
            <div>
              <span className="text-xs text-slate-500">Selected Case:</span>
              <span className="ml-2 font-bold text-white">{currentCase.case_id}</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-sm font-medium text-slate-300">{currentCase.patient_name}</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-sm text-cyan-300">{currentCase.medication}</span>
            </div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {currentCase.status.replaceAll("_", " ")}
            </span>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:p-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex animate-pulse gap-4">
                  <div className="h-8 w-8 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-white/10" />
                    <div className="mt-3 h-12 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-xl text-slate-500">
                ∅
              </div>
              <p className="mt-4 text-sm text-slate-400">
                No audit events found for case {selectedCaseId}.
              </p>
            </div>
          ) : (
            <div>
              {events.map((event, index) => (
                <div key={event.id || index} className="relative flex gap-5 pb-8 last:pb-0">
                  {index !== events.length - 1 && (
                    <div className="absolute left-4 top-9 h-full w-px bg-gradient-to-b from-cyan-400/40 to-transparent" />
                  )}

                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-400">
                    ✓
                  </div>

                  <div className="flex-1 rounded-xl border border-white/5 bg-slate-950/40 p-5 transition hover:border-cyan-400/10 hover:bg-slate-900/60">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <h3 className="font-semibold text-white">
                        {event.event_type}
                      </h3>

                      <span className="text-xs text-slate-500">
                        {event.timestamp
                          ? new Date(event.timestamp).toLocaleString()
                          : ""}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {event.description}
                    </p>

                    <div className="mt-4 inline-flex rounded-lg bg-white/5 px-3 py-1.5">
                      <span className="text-xs text-slate-500">Actor:</span>
                      <span className="ml-2 text-xs font-medium text-cyan-300">
                        {event.actor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}