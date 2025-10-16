// components/Home/Filter.tsx
"use client";

import React from "react";

export default function Filter({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (v: any) => void;
}) {
  return (
    <div className="bg-white text-black rounded-md shadow px-8 py-6">
      <div className="text-lg font-semibold mb-4">Filters</div>
      <div className="h-[1px] w-full bg-black/10"></div>

      <div className="flex gap-8 pt-5 justify-between flex-wrap">
        <div>
          <div className="text-[14px] font-semibold mb-1">Status</div>
          <select
            className="border border-gray-300 rounded-md w-56 px-2 py-1"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <div className="text-[14px] font-semibold mb-1">Complaint Type</div>
          <select
            className="border border-gray-300 rounded-md w-56 px-2 py-1"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option>All Types</option>
            <option>Failure to Refund Deposit</option>
            <option>Unlawful Eviction / Lockout</option>
            <option>Utility Disconnection</option>
            <option>Maintenance / Repairs</option>
            <option>Rent Increase Dispute</option>
            <option>Harassment / Privacy Breach</option>
          </select>
        </div>

        <div>
          <div className="text-[14px] font-semibold mb-1">Start Date</div>
          <input
            type="date"
            className="border border-gray-300 rounded-md w-56 px-2 py-1"
            value={filters.start}
            onChange={(e) => setFilters({ ...filters, start: e.target.value })}
          />
        </div>

        <div>
          <div className="text-[14px] font-semibold mb-1">End Date</div>
          <input
            type="date"
            className="border border-gray-300 rounded-md w-56 px-2 py-1"
            value={filters.end}
            onChange={(e) => setFilters({ ...filters, end: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
