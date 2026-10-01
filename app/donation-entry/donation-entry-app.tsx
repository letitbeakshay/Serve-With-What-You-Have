"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Baby, Backpack, Bed, BedDouble, Briefcase, Footprints, Mars, Package, Shirt, ShoppingBag, TowelRack, Venus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AGE_CATEGORY_LABELS,
  GARMENTS_BY_GENDER,
  GENDER_LABELS,
  getGarmentIconKey,
  type AgeCategory,
  type Gender,
} from "@/lib/garment-catalog";

type Donor = { id: string; donorNumber: number; donorName: string; phone: string; donatedAt: string };

type MyItem = {
  id: string;
  donationId: string;
  gender: Gender;
  ageCategory: AgeCategory | null;
  garmentType: string;
  quantity: number;
  donation: { donorNumber: number; donorName: string };
};

type Step = "gate" | "donor" | "gender" | "age" | "garment" | "quantity" | "added" | "myEntries";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// Six dots flung outward from the success checkmark (see .success-confetti
// in globals.css), evenly spaced around a circle.
const CONFETTI_COLORS = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];
const CONFETTI_DOTS = CONFETTI_COLORS.map((color, i) => {
  const angle = (i / CONFETTI_COLORS.length) * Math.PI * 2;
  const radius = 34;
  return {
    color,
    tx: `${Math.round(Math.cos(angle) * radius)}px`,
    ty: `${Math.round(Math.sin(angle) * radius)}px`,
    delay: i * 0.03,
  };
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

// Thin, named wrappers around lucide-react's icons (already a project
// dependency) so each step's markup reads by meaning, not by which stock
// icon it happens to be.
const MaleIcon = () => <Mars size={22} strokeWidth={2} />;
const FemaleIcon = () => <Venus size={22} strokeWidth={2} />;
const GeneralIcon = () => <Package size={22} strokeWidth={2} />;
const AdultIcon = () => <Briefcase size={22} strokeWidth={2} />;
const TeenIcon = () => <Backpack size={22} strokeWidth={2} />;
const ChildIcon = () => <Baby size={22} strokeWidth={2} />;
// lucide has no icon for trousers or a one-piece outfit (there's no "pants"
// or "saree" icon anywhere), so these two are hand-drawn to match lucide's
// own stroke style (24x24 viewBox, rounded joins, strokeWidth 2).
const PantsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M6 3h12l.6 6-1.1 12h-3l-.9-10-.9 10h-3l-.9-10-.9 10h-3L5.4 9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 8h12" strokeLinecap="round" />
  </svg>
);
const OutfitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M9 3h6l.8 3.5-1.8 1.5 3 13H7l3-13-1.8-1.5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GARMENT_ICON_COMPONENTS = {
  top: Shirt,
  bottom: PantsIcon,
  outfit: OutfitIcon,
  bed: Bed,
  blanket: BedDouble,
  towel: TowelRack,
  bag: ShoppingBag,
  shoe: Footprints,
  other: Package,
};

function GarmentIcon({ garmentType }: { garmentType: string }) {
  const Icon = GARMENT_ICON_COMPONENTS[getGarmentIconKey(garmentType)];
  return <Icon size={18} strokeWidth={2} />;
}

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

  // Set when correcting an existing entry rather than logging a new one --
  // routes the same gender/age/garment/quantity screens to a PATCH instead
  // of a POST, and "quantity" is the entry point rather than "gender".
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [myItems, setMyItems] = useState<MyItem[] | null>(null);
  const [myItemsError, setMyItemsError] = useState<string | null>(null);

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

  async function loadMyItems() {
    setMyItemsError(null);
    try {
      const res = await fetch("/api/donation-entry/my-items");
      const json = await res.json();
      if (json.ok) setMyItems(json.items);
      else setMyItemsError("Could not load your entries.");
    } catch {
      setMyItemsError("Could not reach the server.");
    }
  }

  function openMyEntries() {
    loadMyItems();
    setStep("myEntries");
  }

  function startEditItem(item: MyItem) {
    setEditingItemId(item.id);
    setSelectedDonor({
      id: item.donationId,
      donorNumber: item.donation.donorNumber,
      donorName: item.donation.donorName,
      phone: "",
      donatedAt: "",
    });
    setGender(item.gender);
    setAgeCategory(item.ageCategory);
    setGarmentType(item.garmentType);
    setQuantity(item.quantity);
    setSubmitError(null);
    setStep("quantity");
  }

  function cancelEdit() {
    setEditingItemId(null);
    setSelectedDonor(null);
    resetItemState();
    setStep("myEntries");
  }

  async function deleteMyItem(id: string) {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    try {
      const res = await fetch(`/api/donation-entry/items/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setMyItems((items) => (items ? items.filter((item) => item.id !== id) : items));
      } else {
        window.alert(json.error ?? "Could not delete that entry.");
      }
    } catch {
      window.alert("Could not reach the server.");
    }
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
      const url = editingItemId ? `/api/donation-entry/items/${editingItemId}` : "/api/donation-entry/items";
      const body = editingItemId
        ? { gender, ageCategory, garmentType, quantity }
        : { donationId: selectedDonor.id, gender, ageCategory, garmentType, quantity };
      const res = await fetch(url, {
        method: editingItemId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.ok) {
        if (editingItemId) {
          setEditingItemId(null);
          resetItemState();
          setSelectedDonor(null);
          await loadMyItems();
          setStep("myEntries");
        } else {
          setLastAdded({ garmentType, gender, ageCategory, quantity });
          setStep("added");
        }
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
    // Clear the actual session cookie, not just local state -- otherwise a
    // reload re-reads the still-valid cookie and logs the old volunteer
    // straight back in at the donor step.
    fetch("/api/donation-entry/logout", { method: "POST" }).catch(() => {});
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
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="font-heading text-xl font-semibold text-foreground">Who donated?</h1>
            <div className="flex shrink-0 items-center gap-3">
              <button type="button" onClick={openMyEntries} className="text-xs text-muted-foreground underline">
                My entries
              </button>
              <button type="button" onClick={switchVolunteer} className="text-xs text-muted-foreground underline">
                Not {volunteerName}?
              </button>
            </div>
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
            onBack={() => (editingItemId ? cancelEdit() : setStep("donor"))}
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
                  <GarmentIcon garmentType={g} />
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
            {editingItemId ? (submitting ? "Saving…" : "Save changes") : submitting ? "Adding…" : "Add item"}
          </Button>
        </>
      )}

      {step === "added" && lastAdded && selectedDonor && (
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="relative flex size-16 items-center justify-center">
            <span className="success-pop-ring absolute inset-0 rounded-full bg-primary/30" />
            {CONFETTI_DOTS.map((dot, i) => (
              <span
                key={i}
                className="success-confetti absolute size-1.5 rounded-full"
                style={
                  {
                    background: dot.color,
                    animationDelay: `${dot.delay}s`,
                    "--tx": dot.tx,
                    "--ty": dot.ty,
                  } as CSSProperties
                }
              />
            ))}
            <div className="success-pop-check relative flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">Nice one!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lastAdded.quantity} &times; {lastAdded.garmentType}
            {lastAdded.ageCategory ? ` (${GENDER_LABELS[lastAdded.gender]}, ${AGE_CATEGORY_LABELS[lastAdded.ageCategory]})` : ` (${GENDER_LABELS[lastAdded.gender]})`}
            <br />
            for #{selectedDonor.donorNumber} · {selectedDonor.donorName}
          </p>
          <div className="mt-8 w-full space-y-3">
            <Button onClick={addAnotherItem} className="success-nudge h-12 w-full text-base">
              Add another item for #{selectedDonor.donorNumber}
            </Button>
            <Button onClick={finishDonor} variant="outline" className="h-12 w-full text-base">
              Done, choose another donor
            </Button>
          </div>
        </div>
      )}

      {step === "myEntries" && (
        <>
          <BackBar title="My entries" onBack={() => setStep("donor")} />
          {myItemsError && <p className="text-sm text-destructive">{myItemsError}</p>}
          {myItems === null && !myItemsError && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
          {myItems !== null && myItems.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing logged yet. Once you add an item it will show up here, so you can fix it
              yourself without asking the admin.
            </p>
          )}
          <div className="space-y-2.5">
            {myItems?.map((item) => (
              <div key={item.id} className="rounded-xl border-2 border-border bg-card px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  {item.quantity} &times; {item.garmentType}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {GENDER_LABELS[item.gender]}
                  {item.ageCategory ? `, ${AGE_CATEGORY_LABELS[item.ageCategory]}` : ""} &middot; for #
                  {item.donation.donorNumber} &middot; {item.donation.donorName}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => startEditItem(item)} variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button onClick={() => deleteMyItem(item.id)} variant="outline" size="sm" className="flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
