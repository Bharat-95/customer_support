"use client";

import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const Hero = () => {
  const [stats, setStats] = useState({
    submitted: 0,
    underReview: 0,
    resolved: 0,
    scheduled: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const supabase = supabaseBrowser;

      // Define first day of the current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all complaints created since the start of this month
      const { data, error } = await supabase
        .from("complaints")
        .select("status, created_at")
        .gte("created_at", firstDay);

      if (error) {
        console.error("Error loading stats:", error);
        return;
      }

      const counts = {
        submitted: data.filter((c) => c.status?.toLowerCase() === "submitted").length,
        underReview: data.filter((c) => c.status?.toLowerCase() === "under review").length,
        resolved: data.filter((c) => c.status?.toLowerCase() === "resolved").length,
        scheduled: data.filter((c) => c.status?.toLowerCase() === "scheduled").length,
      };

      setStats(counts);
    }

    fetchStats();
  }, []);

  return (
    <div className="flex flex-wrap justify-between pt-10">
      <Card color="bg-sky-600" title="Submitted This Month" value={stats.submitted} />
      <Card color="bg-amber-600" title="Under Review" value={stats.underReview} />
      <Card color="bg-indigo-600" title="Scheduled Hearings" value={stats.scheduled} />
      <Card color="bg-green-600" title="Resolved Cases" value={stats.resolved} />
    </div>
  );
};

function Card({
  color,
  title,
  value,
}: {
  color: string;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white shadow-lg flex rounded-md text-black px-5 py-5 gap-5 min-w-[300px]">
      <div
        className={`${color} flex justify-center items-center text-white rounded-full h-10 w-10 font-bold shadow-lg`}
      >
        {value}
      </div>
      <div>
        <div className="text-md font-medium">{title}</div>
        <div className="font-black text-lg">{value}</div>
      </div>
    </div>
  );
}

export default Hero;
