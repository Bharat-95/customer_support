// app/admin/page.tsx
"use client";

import React, { useState } from "react";
import Hero from "@/components/Home/Hero";
import Filter from "@/components/Home/Filter";
import CasesTable from "@/components/Home/Cases";
import Header from "@/components/Header";

export default function AdminPage() {
  const [filters, setFilters] = useState({
    status: "All Statuses",
    type: "All Types",
    start: "",
    end: "",
  });

  return (
    <div className="space-y-10">
      <Header />
      <Hero />
      <Filter filters={filters} setFilters={setFilters} />
      <CasesTable filters={filters} />
    </div>
  );
}
