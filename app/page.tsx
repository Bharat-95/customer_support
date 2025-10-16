"use client";

import Link from "next/link";
import { Plus, BarChart3, FileText, ClipboardCheck, Clock, ShieldCheck } from "lucide-react";

export default function CaseManagementLanding() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 rounded-md overflow-hidden shadow-md">

      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-semibold tracking-tight">Rental Housing Tribunal</span>
              <span className="text-xs text-slate-500 -mt-0.5">Case Management System</span>
            </div>
         
          </div>
        </div>
      </header>


      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="py-10 sm:py-14 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to the Case Management System
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-slate-500">
            Submit housing complaints, track their progress, and manage cases efficiently through our comprehensive system.
          </p>
        </div>

  
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
       
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 grid place-items-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Submit New Complaint</h3>
            <p className="mt-2 text-sm text-slate-500">
              File a new rental housing complaint using our structured form that guides you through all required information.
            </p>
            <Link
              href="/complaint-form"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Start New Complaint
              <span className="ml-2">➜</span>
            </Link>
          </div>

         
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Admin Dashboard</h3>
            <p className="mt-2 text-sm text-slate-500">
              Manage all submitted cases, update statuses, assign reviewers, and track case progression through the system.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
            >
              Access Dashboard
              <span className="ml-2">➜</span>
            </Link>
          </div>
        </div>
      </section>

     
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12">
          <h2 className="text-center text-lg font-extrabold text-slate-900">System Features</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<FileText className="w-5 h-5" />}
              title="Guided Forms"
              desc="Easy multi-step forms collect all details and documents."
              color="bg-blue-50 text-blue-600"
            />
            <Feature
              icon={<ClipboardCheck className="w-5 h-5" />}
              title="Status Tracking"
              desc="Follow your case from submission to outcome."
              color="bg-violet-50 text-violet-600"
            />
            <Feature
              icon={<Clock className="w-5 h-5" />}
              title="Reminders"
              desc="Get notified about hearings and document deadlines."
              color="bg-amber-50 text-amber-600"
            />
            <Feature
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Secure & Compliant"
              desc="Your information is protected and handled responsibly."
              color="bg-emerald-50 text-emerald-600"
            />
          </div>
        </div>
      </section>

    
      <footer className="mt-4 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Rental Housing Tribunal</span>
          <div className="space-x-4">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="/help" className="hover:text-slate-700">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className={`w-9 h-9 rounded-xl grid place-items-center ${color}`}>{icon}</div>
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
