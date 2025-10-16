"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

/** ---------------- Types ---------------- */
type Complainant = {
  type?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  gender?: string;
  email?: string;
  homePhone?: string;
  workPhone?: string;
  mobilePhone?: string;
  physical: { street?: string; suburb?: string; postalCode?: string };
  postal: { street?: string; suburb?: string; postalCode?: string };
  preferredComm?: string;
};

type Respondent = {
  title?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  email?: string;
  homePhone?: string;
  mobilePhone?: string;
  workPhone?: string;
  physical: { street?: string; suburb?: string; postalCode?: string };
};

type Property = {
  address?: string;
  type?: string;
};

type Complaint = {
  type?: string;
  details?: string;
};

type Representative = {
  repType?: string;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: { street?: string; suburb?: string; postalCode?: string };
};

type FormState = {
  complainant: Complainant;
  respondent: Respondent;
  property: Property;
  complaint: Complaint;
  representative?: Representative;
};

type Confirmation = {
  id: string;
  createdAt: string; // ISO
  reference: string;
  status: "Submitted";
};

/** ---------------- UI helpers ---------------- */
const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-slate-800 mb-1">{children}</label>
);

const Text = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cx(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900",
      "focus:outline-none focus:ring-2 focus:ring-emerald-200",
      props.className
    )}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={cx(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900",
      "focus:outline-none focus:ring-2 focus:ring-emerald-200",
      props.className
    )}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={cx(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900",
      "focus:outline-none focus:ring-2 focus:ring-emerald-200",
      props.className
    )}
  />
);

/** ---------------- Page ---------------- */
export default function NewComplaintPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const total = 6;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [data, setData] = useState<FormState>({
    complainant: { physical: {}, postal: {}, preferredComm: "Email" },
    respondent: { physical: {} },
    property: {},
    complaint: {},
    representative: { address: {} },
  });

  const pct = useMemo(() => Math.round((step / total) * 100), [step, total]);

  function next() {
    setStep((s) => Math.min(total, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** -------- Validation per step -------- */
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (step === 1) {
      const c = data.complainant;
      if (!c.type) errs.push("Complainant Type is required.");
      if (!c.firstName) errs.push("First Name is required.");
      if (!c.lastName) errs.push("Last Name is required.");
      if (!c.idNumber) errs.push("ID/Passport Number is required.");
      if (!c.email) errs.push("Email is required.");
      if (!c.physical.street || !c.physical.suburb || !c.physical.postalCode) {
        errs.push("Physical Address (street, suburb, postal code) is required.");
      }
    }
    if (step === 2) {
      const r = data.respondent;
      if (!r.lastName) errs.push("Respondent Last Name is required.");
      if (!r.physical.street || !r.physical.suburb || !r.physical.postalCode) {
        errs.push("Respondent Physical Address is required.");
      }
    }
    if (step === 3) {
      if (!data.property.address) errs.push("Property Address is required.");
      if (!data.property.type) errs.push("Property Type is required.");
    }
    if (step === 4) {
      if (!data.complaint.type) errs.push("Complaint Type is required.");
    }
    return errs;
  }, [step, data]);
  const canNext = errors.length === 0;

  /** -------- Fill Test Data (per step) -------- */
  function fillStepData() {
    switch (step) {
      case 1:
        setData((d) => ({
          ...d,
          complainant: {
            ...d.complainant,
            type: "Tenant",
            title: "Mr",
            firstName: "John",
            lastName: "Doe",
            idNumber: "8001015009087",
            gender: "Male",
            email: "john.doe@example.com",
            homePhone: "021-555-1234",
            workPhone: "021-555-5678",
            mobilePhone: "082-123-4567",
            physical: { street: "123 Main Road", suburb: "Observatory", postalCode: "7925" },
            postal: { street: "", suburb: "", postalCode: "" },
            preferredComm: "Email",
          },
        }));
        break;
      case 2:
        setData((d) => ({
          ...d,
          respondent: {
            title: "Ms",
            firstName: "Sarah",
            lastName: "Johnson",
            idNumber: "7505125008084",
            email: "sarah.johnson@property.co.za",
            homePhone: "021-777-8888",
            workPhone: "021-999-0000",
            mobilePhone: "083-987-6543",
            physical: { street: "456 Oak Avenue", suburb: "Rondebosch", postalCode: "7700" },
          },
        }));
        break;
      case 3:
        setData((d) => ({ ...d, property: { address: "789 Pine Road, Newlands, Cape Town, 7700", type: "Flat" } }));
        break;
      case 4:
        setData((d) => ({
          ...d,
          complaint: {
            type: "Failure to Refund Deposit",
            details:
              "Landlord has not returned deposit within 14 days after lease end. Provided exit inspection and proof of payments.",
          },
        }));
        break;
      case 5:
        setData((d) => ({
          ...d,
          representative: {
            repType: "Attorney",
            name: "Michael Brown",
            company: "Brown & Associates Legal",
            phone: "021-555-7890",
            email: "mbrown@brownlaw.co.za",
            address: { street: "100 Business Park", suburb: "Century City", postalCode: "7441" },
          },
        }));
        break;
      default:
        break;
    }
  }

  /** -------- Helpers -------- */
  function genReference() {
    // RHT-<8 hex uppercase>
    const n = Math.floor(Math.random() * 0xffffffff);
    return `RHT-${n.toString(16).toUpperCase().padStart(8, "0")}`;
  }

  /** -------- Save to Supabase -------- */
  async function onSubmit() {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = supabaseBrowser;
      const reference = genReference();

      const { data: inserted, error } = await supabase
        .from("complaints")
        .insert({
          status: "Submitted",
          reference,
          complainant: data.complainant,
          respondent: data.respondent,
          property: data.property,
          complaint: data.complaint,
          representative: data.representative ?? null,
        })
        .select("id, created_at, reference, status")
        .single();

      if (error) throw error;

      setConfirmation({
        id: inserted.id,
        createdAt: inserted.created_at,
        reference: inserted.reference,
        status: inserted.status as "Submitted",
      });
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save complaint.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  /** -------- Landing vs Form vs Confirmation -------- */
  if (!started) return <Landing onStart={() => setStarted(true)} />;

  if (confirmation) {
    return (
      <GradientShell>
        <ConfirmationView confirmation={confirmation} data={data} onNew={() => window.location.reload()} />
      </GradientShell>
    );
  }

  return (
    <GradientShell>
      {/* Top meta bar */}
      <div className="px-6 pt-4 flex items-center justify-between text-black">
        <div className="text-sm">Step {step} of {total}</div>
        <div className="text-sm">
          {step === 1 && "Complainant Information"}
          {step === 2 && "Respondent Information"}
          {step === 3 && "Property in Dispute"}
          {step === 4 && "Complaint Information"}
          {step === 5 && "Representative (Optional)"}
          {step === 6 && "Review & Submit"}
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 mt-2">
        <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
          <div className="h-full bg-black/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto mt-5 mb-10 w-full max-w-5xl rounded-[28px] bg-white shadow-xl p-6 sm:p-8">
        {saveError && (
          <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 p-3 text-sm">
            {saveError}
          </div>
        )}

        {step === 1 && (<><StepTitle title="Complainant Information" /><ComplainantForm data={data.complainant} onChange={(c) => setData((d) => ({ ...d, complainant: c }))} /></>)}
        {step === 2 && (<><StepTitle title="Respondent Information" /><RespondentForm data={data.respondent} onChange={(r) => setData((d) => ({ ...d, respondent: r }))} /></>)}
        {step === 3 && (<><StepTitle title="Property in Dispute" /><PropertyForm data={data.property} onChange={(p) => setData((d) => ({ ...d, property: p }))} /></>)}
        {step === 4 && (<><StepTitle title="Complaint Information" /><ComplaintForm data={data.complaint} onChange={(c) => setData((d) => ({ ...d, complaint: c }))} /></>)}
        {step === 5 && (<><StepTitle title="Representative (Optional)" /><RepresentativeForm data={data.representative!} onChange={(r) => setData((d) => ({ ...d, representative: r }))} /></>)}
        {step === 6 && (<><StepTitle title="Review & Submit" /><PreviewSummary data={data} /></>)}

        {errors.length > 0 && step !== 6 && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
            <div className="font-semibold mb-1">Please fix the following:</div>
            <ul className="list-disc pl-5 space-y-1">{errors.map((e, i) => (<li key={i}>{e}</li>))}</ul>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={prev}
            disabled={step === 1 || saving}
            className={cx("px-5 py-3 rounded-xl border border-slate-300 text-slate-800 bg-white shadow-sm",
              step === 1 && "opacity-40 cursor-not-allowed")}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={fillStepData}
            className="px-5 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600"
          >
            Fill Test Data
          </button>

          {step < total ? (
            <button
              onClick={next}
              disabled={!canNext || saving}
              className={cx("px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow",
                (!canNext || saving) && "opacity-50 cursor-not-allowed")}
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={saving}
              className={cx("px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow",
                saving && "opacity-60 cursor-wait")}
            >
              {saving ? "Submitting…" : "Submit Complaint"}
            </button>
          )}
        </div>
      </div>
    </GradientShell>
  );
}

/** ---------------- Shell & Headings ---------------- */
function GradientShell({ children }: { children: React.ReactNode }) {
  // keep your neutral shell (you asked not to change colors drastically)
  return <div className="min-h-screen p-4 sm:p-6 text-black">{children}</div>;
}
function StepTitle({ title }: { title: string }) {
  return <h2 className="text-2xl font-extrabold text-slate-900 mb-5">{title}</h2>;
}

/** ---------------- Landing ---------------- */
function Landing({ onStart }: { onStart: () => void }) {
  return (
    <GradientShell>
      <div className="mx-auto w-full max-w-4xl rounded-[28px] bg-white shadow-xl p-8 sm:p-12 mt-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800">Rental Housing Tribunal</h1>
          <p className="text-sm text-slate-600 mt-1">Complaint Submission Portal</p>
          <p className="text-xs text-slate-500">Western Cape Government</p>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900">Submit Your Rental Complaint</h3>
          <p className="mt-2 text-slate-700">
            This secure online portal allows you to submit complaints related to rental housing disputes directly to the
            Western Cape Rental Housing Tribunal. Our streamlined process ensures your complaint is properly documented and processed efficiently.
          </p>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <Pill>📋 Step-by-step guided form</Pill>
          <Pill>🔒 Secure document upload</Pill>
          <Pill>⚡ Fast processing</Pill>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-50 p-5 text-slate-800">
          <div className="font-semibold mb-2">Before You Begin:</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Have your lease agreement ready to upload</li>
            <li>Gather any supporting documents (photos, correspondence, receipts)</li>
            <li>Prepare contact details for all parties involved</li>
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <button onClick={onStart} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800">
            📋 Start Complaint Form
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-600">
          <Link href="/" className="hover:underline">Back to Home</Link>
        </div>
      </div>
    </GradientShell>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-300 bg-white py-3 px-4 text-center text-sm text-slate-800">{children}</div>;
}

/** ---------------- Step Forms ---------------- */
function ComplainantForm({ data, onChange }: { data: Complainant; onChange: (v: Complainant) => void; }) { /* ...unchanged controls... */ 
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Type *</Label>
          <Select value={data.type || ""} onChange={(e) => onChange({ ...data, type: e.target.value })}>
            <option value="">Select Type</option><option>Tenant</option><option>Landlord</option><option>Agent</option>
          </Select></div>
        <div><Label>Title</Label>
          <Select value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })}>
            <option value="">Select Title</option><option>Mr</option><option>Ms</option><option>Mrs</option><option>Dr</option>
          </Select></div>
        <div><Label>Gender</Label>
          <Select value={data.gender || ""} onChange={(e) => onChange({ ...data, gender: e.target.value })}>
            <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </Select></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>First Name *</Label><Text value={data.firstName || ""} onChange={(e) => onChange({ ...data, firstName: e.target.value })} /></div>
        <div><Label>Last Name *</Label><Text value={data.lastName || ""} onChange={(e) => onChange({ ...data, lastName: e.target.value })} /></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>ID/Passport Number *</Label><Text value={data.idNumber || ""} onChange={(e) => onChange({ ...data, idNumber: e.target.value })} /></div>
        <div><Label>Email *</Label><Text type="email" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Home Phone</Label><Text value={data.homePhone || ""} onChange={(e) => onChange({ ...data, homePhone: e.target.value })} /></div>
        <div><Label>Work Phone</Label><Text value={data.workPhone || ""} onChange={(e) => onChange({ ...data, workPhone: e.target.value })} /></div>
        <div><Label>Mobile Phone</Label><Text value={data.mobilePhone || ""} onChange={(e) => onChange({ ...data, mobilePhone: e.target.value })} /></div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Physical Address *</legend>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Street *</Label><Text value={data.physical.street || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, street: e.target.value } })} /></div>
          <div><Label>Suburb *</Label><Text value={data.physical.suburb || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, suburb: e.target.value } })} /></div>
          <div><Label>Postal Code *</Label><Text value={data.physical.postalCode || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, postalCode: e.target.value } })} /></div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Postal Address (if different)</legend>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Street</Label><Text value={data.postal.street || ""} onChange={(e) => onChange({ ...data, postal: { ...data.postal, street: e.target.value } })} /></div>
          <div><Label>Suburb</Label><Text value={data.postal.suburb || ""} onChange={(e) => onChange({ ...data, postal: { ...data.postal, suburb: e.target.value } })} /></div>
          <div><Label>Postal Code</Label><Text value={data.postal.postalCode || ""} onChange={(e) => onChange({ ...data, postal: { ...data.postal, postalCode: e.target.value } })} /></div>
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Preferred Communication Method</Label>
          <Select value={data.preferredComm || "Email"} onChange={(e) => onChange({ ...data, preferredComm: e.target.value })}>
            <option>Email</option><option>Phone</option><option>SMS</option>
          </Select></div>
      </div>
    </div>
  );
}

function RespondentForm({ data, onChange }: { data: Respondent; onChange: (v: Respondent) => void; }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Title</Label>
          <Select value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })}>
            <option value="">Select Title</option><option>Mr</option><option>Ms</option><option>Mrs</option><option>Dr</option>
          </Select></div>
        <div><Label>First Name *</Label><Text value={data.firstName || ""} onChange={(e) => onChange({ ...data, firstName: e.target.value })} /></div>
        <div><Label>Last Name *</Label><Text value={data.lastName || ""} onChange={(e) => onChange({ ...data, lastName: e.target.value })} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>ID/Passport Number</Label><Text value={data.idNumber || ""} onChange={(e) => onChange({ ...data, idNumber: e.target.value })} /></div>
        <div><Label>Email</Label><Text type="email" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} /></div>
        <div><Label>Home Phone</Label><Text value={data.homePhone || ""} onChange={(e) => onChange({ ...data, homePhone: e.target.value })} /></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Work Phone</Label><Text value={data.workPhone || ""} onChange={(e) => onChange({ ...data, workPhone: e.target.value })} /></div>
        <div><Label>Mobile Phone</Label><Text value={data.mobilePhone || ""} onChange={(e) => onChange({ ...data, mobilePhone: e.target.value })} /></div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Physical Address *</legend>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Street *</Label><Text value={data.physical.street || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, street: e.target.value } })} /></div>
          <div><Label>Suburb *</Label><Text value={data.physical.suburb || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, suburb: e.target.value } })} /></div>
          <div><Label>Postal Code *</Label><Text value={data.physical.postalCode || ""} onChange={(e) => onChange({ ...data, physical: { ...data.physical, postalCode: e.target.value } })} /></div>
        </div>
      </fieldset>
    </div>
  );
}

function PropertyForm({ data, onChange }: { data: Property; onChange: (v: Property) => void; }) {
  return (
    <div className="space-y-6">
      <div><Label>Property Address *</Label><Text value={data.address || ""} onChange={(e) => onChange({ ...data, address: e.target.value })} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Property Type *</Label>
          <Select value={data.type || ""} onChange={(e) => onChange({ ...data, type: e.target.value })}>
            <option value="">Select type</option><option>Flat</option><option>House</option><option>Room</option><option>Backyard dwelling</option>
          </Select></div>
      </div>
    </div>
  );
}

function ComplaintForm({ data, onChange }: { data: Complaint; onChange: (v: Complaint) => void; }) {
  return (
    <div className="space-y-6">
      <div><Label>Complaint Type *</Label>
        <Select value={data.type || ""} onChange={(e) => onChange({ ...data, type: e.target.value })}>
          <option value="">Select complaint</option>
          <option>Failure to Refund Deposit</option>
          <option>Unlawful Eviction / Lockout</option>
          <option>Utility Disconnection</option>
          <option>Maintenance / Repairs</option>
          <option>Rent Increase Dispute</option>
          <option>Harassment / Privacy Breach</option>
        </Select></div>
      <div><Label>Details (optional)</Label>
        <TextArea rows={5} placeholder="Briefly describe the issue and key dates…" value={data.details || ""} onChange={(e) => onChange({ ...data, details: e.target.value })} />
      </div>
    </div>
  );
}

function RepresentativeForm({ data, onChange }: { data: Representative; onChange: (v: Representative) => void; }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Representative Type</Label>
          <Select value={data.repType || ""} onChange={(e) => onChange({ ...data, repType: e.target.value })}>
            <option value="">Select type</option><option>Attorney</option><option>Paralegal</option><option>Family Member</option><option>Friend</option>
          </Select></div>
        <div><Label>Name</Label><Text value={data.name || ""} onChange={(e) => onChange({ ...data, name: e.target.value })} /></div>
        <div><Label>Company</Label><Text value={data.company || ""} onChange={(e) => onChange({ ...data, company: e.target.value })} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Phone</Label><Text value={data.phone || ""} onChange={(e) => onChange({ ...data, phone: e.target.value })} /></div>
        <div><Label>Email</Label><Text type="email" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} /></div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Address</legend>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Street</Label><Text value={data.address?.street || ""} onChange={(e) => onChange({ ...data, address: { ...data.address, street: e.target.value } })} /></div>
          <div><Label>Suburb</Label><Text value={data.address?.suburb || ""} onChange={(e) => onChange({ ...data, address: { ...data.address, suburb: e.target.value } })} /></div>
          <div><Label>Postal Code</Label><Text value={data.address?.postalCode || ""} onChange={(e) => onChange({ ...data, address: { ...data.address, postalCode: e.target.value } })} /></div>
        </div>
      </fieldset>
    </div>
  );
}

/** ---------------- Preview (Step 6) ---------------- */
function PreviewSummary({ data }: { data: FormState }) {
  const row = (label: string, value?: React.ReactNode) => (
    <div className="grid sm:grid-cols-3 gap-3">
      <div className="text-slate-500">{label}</div>
      <div className="sm:col-span-2 text-slate-900">{value || <span className="text-slate-400">—</span>}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="font-semibold text-slate-900 mb-3">Complainant</div>
        {row("Name", `${data.complainant.firstName ?? ""} ${data.complainant.lastName ?? ""}`.trim())}
        {row("Type", data.complainant.type)}
        {row("Email", data.complainant.email)}
        {row("Phone", data.complainant.mobilePhone || data.complainant.homePhone || data.complainant.workPhone)}
        {row("Physical Address", `${data.complainant.physical?.street ?? ""}, ${data.complainant.physical?.suburb ?? ""}, ${data.complainant.physical?.postalCode ?? ""}`)}
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="font-semibold text-slate-900 mb-3">Respondent</div>
        {row("Name", `${data.respondent.firstName ?? ""} ${data.respondent.lastName ?? ""}`.trim())}
        {row("Email", data.respondent.email)}
        {row("Phone", data.respondent.mobilePhone || data.respondent.homePhone || data.respondent.workPhone)}
        {row("Physical Address", `${data.respondent.physical?.street ?? ""}, ${data.respondent.physical?.suburb ?? ""}, ${data.respondent.physical?.postalCode ?? ""}`)}
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="font-semibold text-slate-900 mb-3">Property</div>
        {row("Address", data.property.address)}
        {row("Type", data.property.type)}
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="font-semibold text-slate-900 mb-3">Complaint</div>
        {row("Type", data.complaint.type)}
        {row("Details", <span className="whitespace-pre-wrap">{data.complaint.details}</span>)}
      </div>

      <div className="text-xs text-slate-600">
        By submitting, you confirm the information is accurate. This tool provides general guidance and is not legal advice.
      </div>
    </div>
  );
}

/** ---------------- Confirmation View (after save) ---------------- */
function ConfirmationView({
  confirmation,
  data,
  onNew,
}: {
  confirmation: Confirmation;
  data: FormState;
  onNew: () => void;
}) {
  const created = new Date(confirmation.createdAt);
  const createdHuman = created.toLocaleString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const pill = (label: string, value: string, bg: string) => (
    <div className={cx("rounded-xl p-4 border", bg)}>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className="text-slate-900 font-semibold">{value}</div>
    </div>
  );

  return (
    <div className="mx-auto mt-5 mb-10 w-full max-w-5xl space-y-6">
      {/* Case Details */}
      <div className="rounded-[28px] bg-white shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Case Details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {pill("Case ID", confirmation.id, "border-slate-200 bg-slate-50")}
          {pill("Status", confirmation.status, "border-emerald-200 bg-emerald-50")}
          {pill("Submission Date", createdHuman, "border-slate-200 bg-slate-50")}
          {pill("Reference Number", confirmation.reference, "border-violet-200 bg-violet-50")}
        </div>

        <hr className="my-6 border-slate-200" />

        {/* Complaint Summary */}
        <div>
          <div className="text-lg font-semibold text-slate-900 mb-4">Complaint Summary</div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            <div>
              <div className="text-xs text-slate-500">Complainant</div>
              <div className="text-slate-900">
                {(data.complainant.firstName || "") + " " + (data.complainant.lastName || "")}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Respondent</div>
              <div className="text-slate-900">
                {(data.respondent.firstName || "") + " " + (data.respondent.lastName || "")}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-slate-500">Property Address</div>
              <div className="text-slate-900">{data.property.address}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-slate-500">Complaint Type</div>
              <div className="text-slate-900">{data.complaint.type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="rounded-[28px] bg-white shadow-xl p-6 sm:p-8">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-4">What Happens Next?</h3>

        <ol className="space-y-5">
          {[
            {
              t: "Acknowledgment",
              d: "You will receive an email confirmation within 24 hours acknowledging receipt of your complaint.",
            },
            {
              t: "Review Process",
              d: "Our team will review your complaint and supporting documents within 5–7 business days.",
            },
            {
              t: "Contact & Schedule",
              d: "We will contact both parties to schedule a hearing or mediation session.",
            },
            {
              t: "Resolution",
              d: "The tribunal will make a ruling based on the evidence and testimony provided.",
            },
          ].map((s, i) => (
            <li key={i} className="grid grid-cols-[auto,1fr] gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-emerald-700 text-white grid place-items-center font-semibold">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-slate-900">{s.t}</div>
                <div className="text-slate-700">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Important Notes */}
      <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-5">
        <div className="text-lg font-bold text-amber-800 mb-2">Important Notes</div>
        <ul className="list-disc pl-5 text-amber-900 space-y-1">
          <li>
            Keep your case ID (<span className="font-mono">{confirmation.id}</span>) for all future communications
          </li>
          <li>Check your email regularly for updates on your case</li>
          <li>Ensure your contact information is up to date</li>
          <li>Gather any additional supporting documents that may be requested</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="px-5 py-3 rounded-xl bg-indigo-700 text-white font-semibold shadow hover:bg-indigo-800"
        >
          🖨️ Print This Page
        </button>
        <button
          onClick={onNew}
          className="px-5 py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800"
        >
          Submit Another Complaint
        </button>
      </div>
    </div>
  );
}
