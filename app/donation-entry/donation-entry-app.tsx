"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AGE_CATEGORY_LABELS,
  GARMENTS_BY_GENDER,
  GENDER_LABELS,
  type AgeCategory,
  type Gender,
} from "@/lib/garment-catalog";

type Donor = { id: string; donorNumber: number; donorName: string; phone: string; donatedAt: string };

type Step = "gate" | "donor" | "gender" | "age" | "garment" | "quantity" | "added";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// A big, single-tap row. Used for the donor search list, where each option
// carries a name plus identifying sub-details (phone, date) that a small
// icon box has no room for.
function OptionCard({
  label,
  sublabel,
  onClick,
}: {
  label: string;
  sublabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 w-full flex-col items-start justify-center rounded-xl border-2 border-border bg-card px-5 py-3 text-left transition-colors active:border-primary active:bg-primary/5"
    >
      <span className="text-base font-semibold text-foreground">{label}</span>
      {sublabel && <span className="mt-0.5 text-sm text-muted-foreground">{sublabel}</span>}
    </button>
  );
}

// A big square tap target with an icon on top and a label below. Used for
// every fixed-choice step (gender, age, garment) so the whole screen reads
// as a grid of boxes rather than a list of rows.
function IconBox({
  icon,
  label,
  sublabel,
  full,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  full?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-4 text-center transition-colors active:border-primary active:bg-primary/5 ${full ? "col-span-2" : ""}`}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="text-base font-semibold text-foreground">{label}</span>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </button>
  );
}

function IconIntro({ children }: { children: ReactNode }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{children}</svg>;
}

const MaleIcon = () => (
  <IconIntro>
    <circle cx="12" cy="6.5" r="2.7" />
    <path d="M8.5 21v-6.5H6.5l1.8-5.5h7.4l1.8 5.5h-2V21" strokeLinecap="round" strokeLinejoin="round" />
  </IconIntro>
);
const FemaleIcon = () => (
  <IconIntro>
    <circle cx="12" cy="6.5" r="2.7" />
    <path d="M8.5 21l1.2-7.5-2.7-2.5L9.5 6h5l2.5 5-2.7 2.5L15.5 21" strokeLinecap="round" strokeLinejoin="round" />
  </IconIntro>
);
const GeneralIcon = () => (
  <IconIntro>
    <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 7.5v9L12 21l9-4.5v-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12v9" strokeLinecap="round" />
  </IconIntro>
);
const AdultIcon = () => (
  <IconIntro>
    <rect x="8" y="7" width="8" height="6" rx="1" strokeLinejoin="round" />
    <path d="M9.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" />
    <path d="M8 10.5h8" strokeLinecap="round" />
  </IconIntro>
);
const TeenIcon = () => (
  <IconIntro>
    <rect x="6.5" y="7.5" width="11" height="13" rx="3" strokeLinejoin="round" />
    <path d="M9 7.5V5.3a3 3 0 0 1 6 0v2.2" strokeLinecap="round" />
    <rect x="9" y="11" width="6" height="4" rx="1" strokeLinejoin="round" />
  </IconIntro>
);
const ChildIcon = () => (
  <IconIntro>
    <rect x="9.5" y="10" width="5" height="9" rx="2" strokeLinejoin="round" />
    <path d="M10.5 10V7.3a1.5 1.5 0 0 1 3 0V10" strokeLinecap="round" />
    <circle cx="12" cy="5" r="1.2" />
    <path d="M9.5 13.5h5" strokeLinecap="round" />
  </IconIntro>
);
const HangerIcon = () => (
  <IconIntro>
    <path d="M12 3.5a1.8 1.8 0 1 1 1.6 2.7L12 7.3V8.8" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M12 8.8c4.2 1.7 8 4.1 8 6.6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1c0-2.5 3.8-4.9 8-6.6Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconIntro>
);

function BackBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card active:bg-muted"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <h1 className="font-heading text-xl font-semibold text-foreground">{title}</h1>
    </div>
  );
}

export function DonationEntryApp() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [volunteerName, setVolunteerName] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("gate");

  const [gateName, setGateName] = useState("");
  const [gateCode, setGateCode] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateSubmitting, setGateSubmitting] = useState(false);

  const [donors, setDonors] = useState<Donor[] | null>(null);
  const [donorFilter, setDonorFilter] = useState("");
  const [donorsError, setDonorsError] = useState<string | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const [gender, setGender] = useState<Gender | null>(null);
  const [ageCategory, setAgeCategory] = useState<AgeCategory | null>(null);
  const [garmentType, setGarmentType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<{
    garmentType: string;
    gender: Gender;
    ageCategory: AgeCategory | null;
    quantity: number;
  } | null>(null);

  async function loadDonors() {
    setDonorsError(null);
    try {
      const res = await fetch("/api/donation-entry/donors");
      const json = await res.json();
      if (json.ok) setDonors(json.donors);
      else setDonorsError("Could not load donors. Pull to refresh.");
    } catch {
      setDonorsError("Could not load donors. Check your connection.");
    }
  }

  useEffect(() => {
    fetch("/api/donation-entry/session")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setVolunteerName(json.volunteerName);
          setStep("donor");
          loadDonors();
        }
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleGateSubmit(e: FormEvent) {
    e.preventDefault();
    setGateError(null);
    setGateSubmitting(true);
    try {
      const res = await fetch("/api/donation-entry/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteerName: gateName, code: gateCode }),
      });
      const json = await res.json();
      if (json.ok) {
        setVolunteerName(json.volunteerName);
        setStep("donor");
        loadDonors();
      } else {
        setGateError(json.error ?? "Something went wrong.");
      }
    } catch {
      setGateError("Could not reach the server. Check your connection.");
    } finally {
      setGateSubmitting(false);
    }
  }

  const filteredDonors = useMemo(() => {
    if (!donors) return [];
    const q = donorFilter.trim().toLowerCase();
    if (!q) return donors;
    return donors.filter(
      (d) =>
        d.donorName.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        String(d.donorNumber).includes(q),
    );
  }, [donors, donorFilter]);

  function resetItemState() {
    setGender(null);
    setAgeCategory(null);
    setGarmentType(null);
    setQuantity(1);
    setSubmitError(null);
  }

  function pickDonor(donor: Donor) {
    setSelectedDonor(donor);
    resetItemState();
    setStep("gender");
  }

  function pickGender(g: Gender) {
    setGender(g);
    setAgeCategory(null);
    setGarmentType(null);
    setStep(g === "GENERAL" ? "garment" : "age");
  }

  function pickAge(a: AgeCategory) {
    setAgeCategory(a);
    setGarmentType(null);
    setStep("garment");
  }

  function pickGarment(g: string) {
    setGarmentType(g);
    setQuantity(1);
    setStep("quantity");
  }

  async function submitItem() {
    if (!selectedDonor || !gender || !garmentType) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/donation-entry/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: selectedDonor.id,
          gender,
          ageCategory,
          garmentType,
          quantity,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setLastAdded({ garmentType, gender, ageCategory, quantity });
        setStep("added");
      } else {
        setSubmitError(json.error ?? "Something went wrong.");
      }
    } catch {
      setSubmitError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  function addAnotherItem() {
    resetItemState();
    setStep("gender");
  }

  function finishDonor() {
    resetItemState();
    setSelectedDonor(null);
    setDonorFilter("");
    setStep("donor");
  }

  function switchVolunteer() {
    setVolunteerName(null);
    setSelectedDonor(null);
    setDonors(null);
    resetItemState();
    setGateName("");
    setGateCode("");
    setStep("gate");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-background px-5 py-8">
      {step === "gate" && (
        <>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Donation Entry</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Serve With What You Have &mdash; for volunteers logging clothes.
          </p>
          <form onSubmit={handleGateSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gateName">Your name</Label>
              <Input
                id="gateName"
                value={gateName}
                onChange={(e) => setGateName(e.target.value)}
                autoComplete="name"
                autoFocus
                required
                className="h-12 text-base"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gateCode">Volunteer code</Label>
              <Input
                id="gateCode"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                required
                className="h-12 text-center text-lg tracking-[0.3em]"
              />
            </div>
            {gateError && <p className="text-sm text-destructive">{gateError}</p>}
            <Button type="submit" disabled={gateSubmitting} className="h-12 w-full text-base">
              {gateSubmitting ? "Checking…" : "Continue"}
            </Button>
          </form>
        </>
      )}

      {step === "donor" && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h1 className="font-heading text-xl font-semibold text-foreground">Who donated?</h1>
            <button type="button" onClick={switchVolunteer} className="text-xs text-muted-foreground underline">
              Not {volunteerName}?
            </button>
          </div>
          <Input
            value={donorFilter}
            onChange={(e) => setDonorFilter(e.target.value)}
            placeholder="Search by name or number"
            className="h-12 text-base"
            autoFocus
          />
          <div className="mt-4 space-y-2.5">
            {donorsError && <p className="text-sm text-destructive">{donorsError}</p>}
            {donors === null && !donorsError && (
              <p className="text-sm text-muted-foreground">Loading donors…</p>
            )}
            {donors !== null && filteredDonors.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No donors match that search. Ask the admin to log this donor first.
              </p>
            )}
            {filteredDonors.map((donor) => (
              <OptionCard
                key={donor.id}
                label={`#${donor.donorNumber} · ${donor.donorName}`}
                sublabel={`${donor.phone} · ${dateFormatter.format(new Date(donor.donatedAt))}`}
                onClick={() => pickDonor(donor)}
              />
            ))}
          </div>
        </>
      )}

      {step === "gender" && selectedDonor && (
        <>
          <BackBar
            title={`#${selectedDonor.donorNumber} · ${selectedDonor.donorName}`}
            onBack={() => setStep("donor")}
          />
          <p className="mb-4 text-sm text-muted-foreground">Who is this item for?</p>
          <div className="grid grid-cols-2 gap-3">
            <IconBox icon={<MaleIcon />} label={GENDER_LABELS.MALE} onClick={() => pickGender("MALE")} />
            <IconBox icon={<FemaleIcon />} label={GENDER_LABELS.FEMALE} onClick={() => pickGender("FEMALE")} />
            <IconBox
              icon={<GeneralIcon />}
              label={GENDER_LABELS.GENERAL}
              sublabel="Bedsheets, blankets, towels..."
              full
              onClick={() => pickGender("GENERAL")}
            />
          </div>
        </>
      )}

      {step === "age" && gender && selectedDonor && (
        <>
          <BackBar
            title={`#${selectedDonor.donorNumber} · ${GENDER_LABELS[gender]}`}
            onBack={() => setStep("gender")}
          />
          <p className="mb-4 text-sm text-muted-foreground">Age category?</p>
          <div className="grid grid-cols-2 gap-3">
            <IconBox icon={<AdultIcon />} label={AGE_CATEGORY_LABELS.ADULT} onClick={() => pickAge("ADULT")} />
            <IconBox icon={<TeenIcon />} label={AGE_CATEGORY_LABELS.TEEN} onClick={() => pickAge("TEEN")} />
            <IconBox
              icon={<ChildIcon />}
              label={AGE_CATEGORY_LABELS.CHILD}
              full
              onClick={() => pickAge("CHILD")}
            />
          </div>
        </>
      )}

      {step === "garment" && gender && selectedDonor && (
        <>
          <BackBar
            title={`#${selectedDonor.donorNumber} · What is it?`}
            onBack={() => setStep(gender === "GENERAL" ? "gender" : "age")}
          />
          <div className="grid grid-cols-2 gap-2.5">
            {GARMENTS_BY_GENDER[gender].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => pickGarment(g)}
                className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-card px-2 py-3 text-center transition-colors active:border-primary active:bg-primary/5"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HangerIcon />
                </span>
                <span className="text-sm font-semibold text-foreground">{g}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "quantity" && garmentType && selectedDonor && (
        <>
          <BackBar title={`#${selectedDonor.donorNumber} · ${garmentType}`} onBack={() => setStep("garment")} />
          <p className="text-sm text-muted-foreground">How many?</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
              className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-card text-2xl font-semibold active:bg-muted"
            >
              &minus;
            </button>
            <Input
              value={quantity}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                setQuantity(Number.isFinite(n) && n > 0 ? Math.min(n, 999) : 1);
              }}
              inputMode="numeric"
              className="h-14 w-24 text-center text-2xl font-semibold"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(999, q + 1))}
              aria-label="Increase"
              className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-card text-2xl font-semibold active:bg-muted"
            >
              +
            </button>
          </div>
          {submitError && <p className="mt-4 text-sm text-destructive">{submitError}</p>}
          <Button onClick={submitItem} disabled={submitting} className="mt-6 h-12 w-full text-base">
            {submitting ? "Adding…" : "Add item"}
          </Button>
        </>
      )}

      {step === "added" && lastAdded && selectedDonor && (
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">Added</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lastAdded.quantity} &times; {lastAdded.garmentType}
            {lastAdded.ageCategory ? ` (${GENDER_LABELS[lastAdded.gender]}, ${AGE_CATEGORY_LABELS[lastAdded.ageCategory]})` : ` (${GENDER_LABELS[lastAdded.gender]})`}
            <br />
            for #{selectedDonor.donorNumber} · {selectedDonor.donorName}
          </p>
          <div className="mt-8 w-full space-y-3">
            <Button onClick={addAnotherItem} className="h-12 w-full text-base">
              Add another item for #{selectedDonor.donorNumber}
            </Button>
            <Button onClick={finishDonor} variant="outline" className="h-12 w-full text-base">
              Done, choose another donor
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
