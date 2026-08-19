"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  COUNTRY_CODES,
  DECLARATIONS,
  INDIAN_STATES,
  ORG_TYPE_OPTIONS,
  REGISTRATION_STATUS_OPTIONS,
  STEPS,
  SUPPORT_LABELS,
  SUPPORT_OPTIONS,
  VOLUNTEER_HELP_OPTIONS,
  WHO_SERVE_OPTIONS,
  type FieldKey,
} from "@/lib/field-config/v1";
import {
  createEmptyFormData,
  getMostNeededOptions,
  isFieldVisible,
  validateSingleField,
  validateStep,
  type ResponseFormData,
} from "@/lib/field-config/form-state";
import { submitResponse } from "./actions";

const ORG_TYPE_GROUPS = (() => {
  const groups = new Map<string, typeof ORG_TYPE_OPTIONS>();
  for (const option of ORG_TYPE_OPTIONS) {
    const list = groups.get(option.group) ?? [];
    list.push(option);
    groups.set(option.group, list);
  }
  return Array.from(groups.entries());
})();

// Base UI's <Select> only shows the human label on its trigger (instead of
// the raw value) when given this items list directly, separate from the
// SelectItem children rendered inside the popup.
const ORG_TYPE_SELECT_ITEMS = ORG_TYPE_GROUPS.map(([group, options]) => ({
  group,
  items: options.map((option) => ({ value: option.value, label: option.label })),
}));
const STATE_SELECT_ITEMS = INDIAN_STATES.map((s) => ({ value: s, label: s }));
// Trigger shows just the short code ("+91"); the popup list shows the full
// "India (+91)" label via each SelectItem's own children below.
const COUNTRY_CODE_SELECT_ITEMS = COUNTRY_CODES.map((code) => ({ value: code.value, label: code.value }));

type Errors = Partial<Record<FieldKey, string>>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function FieldBlock({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-none py-5 shadow-sm ring-1 ring-border sm:py-6">
      <CardContent className="space-y-3">
        <Label htmlFor={htmlFor} className="font-heading text-base font-semibold text-foreground">
          {label}
        </Label>
        {children}
        {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
        <FieldError message={error} />
      </CardContent>
    </Card>
  );
}

function ToggleChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

function MultiSelectChips({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <ToggleChip
          key={option.value}
          selected={selected.includes(option.value)}
          onClick={() => onToggle(option.value)}
        >
          {option.label}
        </ToggleChip>
      ))}
    </div>
  );
}

export function PublicForm({ formSlug, formName }: { formSlug: string; formName: string }) {
  const storageKey = `swwyh-form:${formSlug}`;
  const [data, setData] = useState<ResponseFormData>(createEmptyFormData);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // One-time hydration from local storage after mount. This has to happen
    // in an effect, not during render, because the server has no local
    // storage to read: rendering the restored value on the first client
    // render would mismatch the server-rendered HTML.
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { data?: Partial<ResponseFormData>; stepIndex?: number };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.data) setData((prev) => ({ ...prev, ...parsed.data }));
        if (typeof parsed.stepIndex === "number") setStepIndex(parsed.stepIndex);
      }
    } catch {
      // Ignore corrupt local storage, just start fresh.
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ data, stepIndex }));
  }, [data, stepIndex, hydrated, storageKey]);

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;
  const progressValue = ((stepIndex + 1) / STEPS.length) * 100;

  const mostNeededOptions = useMemo(() => getMostNeededOptions(data, SUPPORT_LABELS), [data]);

  function updateField<K extends keyof ResponseFormData>(key: K, value: ResponseFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as FieldKey];
      return next;
    });
  }

  function toggleInArray(key: FieldKey, value: string) {
    const current = data[key as keyof ResponseFormData] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateField(key as keyof ResponseFormData, next as ResponseFormData[keyof ResponseFormData]);
  }

  function onFieldBlur(key: FieldKey) {
    const error = validateSingleField(key, data);
    setErrors((prev) => (error ? { ...prev, [key]: error } : prev));
  }

  function updateHeadcount(band: string, gender: "male" | "female", raw: string) {
    const parsed = raw === "" ? 0 : Math.max(0, Number.parseInt(raw, 10) || 0);
    setData((prev) => ({
      ...prev,
      headcounts: {
        ...prev.headcounts,
        [band]: {
          male: gender === "male" ? parsed : (prev.headcounts[band]?.male ?? 0),
          female: gender === "female" ? parsed : (prev.headcounts[band]?.female ?? 0),
        },
      },
    }));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    const stepErrors = validateStep(step.id, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const stepErrors = validateStep(step.id, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitResponse(formSlug, data);
      if (result.success) {
        window.localStorage.removeItem(storageKey);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(result.error);
        if (result.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...(result.fieldErrors as Errors) }));
        }
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6">
        <Card className="w-full max-w-lg rounded-3xl border-none py-10 text-center shadow-md ring-1 ring-border sm:py-14">
          <CardContent className="flex flex-col items-center px-6 sm:px-10">
            <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Thank you
            </h1>
            <p className="mt-4 text-muted-foreground">
              We have your details. Someone from Serve With What You Have will call you to confirm
              everything before anything goes up on the site.
            </p>
            <p className="mt-8 text-sm text-muted-foreground">
              One more thing: an organisation account is coming later. There is nothing to sign up
              for today.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          {!isFirstStep && (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeftIcon className="size-4" />
              Back
            </button>
          )}
          <p className="text-sm font-medium text-primary">{formName}</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {step.title}
          </h1>
          <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
          <div className="mt-6">
            <Progress value={progressValue} aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`} />
            <p className="mt-2 text-sm text-muted-foreground">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
          </div>
        </header>

        <div className="space-y-4">
        {step.id === "basic_identity" && (
          <>
            <FieldBlock label="Organisation name" htmlFor="orgName" error={errors.orgName}>
              <Input
                id="orgName"
                value={data.orgName}
                onChange={(e) => updateField("orgName", e.target.value)}
                onBlur={() => onFieldBlur("orgName")}
              />
            </FieldBlock>

            <FieldBlock label="Type of organisation" htmlFor="orgType" error={errors.orgType}>
              <Select
                items={ORG_TYPE_SELECT_ITEMS}
                value={data.orgType}
                onValueChange={(value) => updateField("orgType", value as string)}
              >
                <SelectTrigger id="orgType" className="w-full">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPE_GROUPS.map(([group, options]) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </FieldBlock>

            {isFieldVisible({ field: "orgType", equals: "other" }, data) && (
              <FieldBlock label="Please specify" htmlFor="orgTypeOther" error={errors.orgTypeOther}>
                <Input
                  id="orgTypeOther"
                  value={data.orgTypeOther}
                  onChange={(e) => updateField("orgTypeOther", e.target.value)}
                  onBlur={() => onFieldBlur("orgTypeOther")}
                />
              </FieldBlock>
            )}
          </>
        )}

        {step.id === "registration_location" && (
          <>
            <FieldBlock label="Are you registered?" error={errors.isRegistered}>
              <RadioGroup
                value={data.isRegistered}
                onValueChange={(value) =>
                  updateField("isRegistered", value as ResponseFormData["isRegistered"])
                }
                className="gap-3"
              >
                {REGISTRATION_STATUS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    htmlFor={`reg-${option.value}`}
                    className="flex items-center gap-3 rounded-lg border border-input px-4 py-3"
                  >
                    <RadioGroupItem value={option.value} id={`reg-${option.value}`} />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </FieldBlock>

            {isFieldVisible({ field: "isRegistered", notEquals: "NO" }, data) && (
              <FieldBlock
                label="Registration number"
                htmlFor="registrationNumber"
                error={errors.registrationNumber}
              >
                <Input
                  id="registrationNumber"
                  value={data.registrationNumber}
                  onChange={(e) => updateField("registrationNumber", e.target.value)}
                />
              </FieldBlock>
            )}

            <FieldBlock label="Year started" htmlFor="yearStarted" error={errors.yearStarted}>
              <Input
                id="yearStarted"
                type="number"
                inputMode="numeric"
                max={new Date().getFullYear()}
                value={data.yearStarted}
                onChange={(e) => updateField("yearStarted", e.target.value)}
                onBlur={() => onFieldBlur("yearStarted")}
              />
            </FieldBlock>

            <FieldBlock label="City" htmlFor="city" error={errors.city}>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                onBlur={() => onFieldBlur("city")}
              />
            </FieldBlock>

            <FieldBlock label="State" htmlFor="state" error={errors.state}>
              <Select
                items={STATE_SELECT_ITEMS}
                value={data.state}
                onValueChange={(value) => updateField("state", value as string)}
              >
                <SelectTrigger id="state" className="w-full">
                  <SelectValue placeholder="Choose your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldBlock>

            <FieldBlock label="PIN code" htmlFor="pinCode" error={errors.pinCode}>
              <Input
                id="pinCode"
                inputMode="numeric"
                maxLength={6}
                value={data.pinCode}
                onChange={(e) => updateField("pinCode", e.target.value.replace(/\D/g, ""))}
                onBlur={() => onFieldBlur("pinCode")}
              />
            </FieldBlock>

            <FieldBlock label="Full address" htmlFor="fullAddress" error={errors.fullAddress}>
              <Textarea
                id="fullAddress"
                value={data.fullAddress}
                onChange={(e) => updateField("fullAddress", e.target.value)}
                onBlur={() => onFieldBlur("fullAddress")}
              />
            </FieldBlock>

            <FieldBlock
              label="Google Maps link or pin"
              htmlFor="mapsLink"
              error={errors.mapsLink}
              hint="Optional, but it helps volunteers find you."
            >
              <Input
                id="mapsLink"
                type="url"
                value={data.mapsLink}
                onChange={(e) => updateField("mapsLink", e.target.value)}
                onBlur={() => onFieldBlur("mapsLink")}
              />
            </FieldBlock>
          </>
        )}

        {step.id === "contact" && (
          <>
            <FieldBlock label="Primary contact name" htmlFor="contactName" error={errors.contactName}>
              <Input
                id="contactName"
                value={data.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                onBlur={() => onFieldBlur("contactName")}
              />
            </FieldBlock>

            <FieldBlock label="Role or designation" htmlFor="contactRole" error={errors.contactRole}>
              <Input
                id="contactRole"
                value={data.contactRole}
                onChange={(e) => updateField("contactRole", e.target.value)}
                onBlur={() => onFieldBlur("contactRole")}
              />
            </FieldBlock>

            <FieldBlock
              label="Phone"
              htmlFor="phone"
              error={errors.phone}
              hint="WhatsApp preferred, 10 digits."
            >
              <div className="flex gap-2">
                <Select
                  items={COUNTRY_CODE_SELECT_ITEMS}
                  value={data.phoneCountryCode}
                  onValueChange={(value) => updateField("phoneCountryCode", value as string)}
                >
                  <SelectTrigger className="w-24 shrink-0" aria-label="Country code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="flex-1"
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                  onBlur={() => onFieldBlur("phone")}
                />
              </div>
            </FieldBlock>

            <FieldBlock label="Alternate phone" htmlFor="altPhone" error={errors.altPhone}>
              <Input
                id="altPhone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={data.altPhone}
                onChange={(e) => updateField("altPhone", e.target.value.replace(/\D/g, ""))}
                onBlur={() => onFieldBlur("altPhone")}
              />
            </FieldBlock>

            <FieldBlock label="Email" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => onFieldBlur("email")}
              />
            </FieldBlock>
          </>
        )}

        {step.id === "scale_and_who_you_serve" && (
          <>
            <FieldBlock
              label="How many people do you currently support?"
              hint="Leave blank if you're not sure."
            >
              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span />
                  <span className="text-center">Male</span>
                  <span className="text-center">Female</span>
                </div>
                {AGE_BANDS.map((band) => (
                  <div key={band.value} className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-2">
                    <Label htmlFor={`hc-${band.value}-male`} className="text-sm font-normal">
                      {band.label}
                    </Label>
                    <Input
                      id={`hc-${band.value}-male`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className="rounded-lg bg-card text-center"
                      value={data.headcounts[band.value]?.male || ""}
                      onChange={(e) => updateHeadcount(band.value, "male", e.target.value)}
                    />
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className="rounded-lg bg-card text-center"
                      value={data.headcounts[band.value]?.female || ""}
                      onChange={(e) => updateHeadcount(band.value, "female", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </FieldBlock>

            <FieldBlock label="Who do you serve?" error={errors.whoServe}>
              <MultiSelectChips
                options={WHO_SERVE_OPTIONS}
                selected={data.whoServe}
                onToggle={(value) => toggleInArray("whoServe", value)}
              />
            </FieldBlock>

            {isFieldVisible({ field: "whoServe", includes: "other" }, data) && (
              <FieldBlock label="Please specify" htmlFor="whoServeOther" error={errors.whoServeOther}>
                <Input
                  id="whoServeOther"
                  value={data.whoServeOther}
                  onChange={(e) => updateField("whoServeOther", e.target.value)}
                  onBlur={() => onFieldBlur("whoServeOther")}
                />
              </FieldBlock>
            )}
          </>
        )}

        {step.id === "what_they_need" && (
          <>
            <FieldBlock label="Which kinds of support can you receive?" error={errors.supportOffered}>
              <MultiSelectChips
                options={SUPPORT_OPTIONS}
                selected={data.supportOffered}
                onToggle={(value) => toggleInArray("supportOffered", value)}
              />
            </FieldBlock>

            {isFieldVisible({ field: "supportOffered", includes: "other" }, data) && (
              <FieldBlock
                label="Please specify"
                htmlFor="supportOfferedOther"
                error={errors.supportOfferedOther}
              >
                <Input
                  id="supportOfferedOther"
                  value={data.supportOfferedOther}
                  onChange={(e) => updateField("supportOfferedOther", e.target.value)}
                  onBlur={() => onFieldBlur("supportOfferedOther")}
                />
              </FieldBlock>
            )}

            <FieldBlock label="Which of these do you need most right now?" error={errors.mostNeeded}>
              {mostNeededOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Choose the support you can receive above first.
                </p>
              ) : (
                <RadioGroup
                  value={data.mostNeeded}
                  onValueChange={(value) => updateField("mostNeeded", value as string)}
                  className="gap-3"
                >
                  {mostNeededOptions.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`most-needed-${option.value}`}
                      className="flex items-center gap-3 rounded-lg border border-input px-4 py-3"
                    >
                      <RadioGroupItem value={option.value} id={`most-needed-${option.value}`} />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </FieldBlock>

            <FieldBlock label="What can volunteers help with?" error={errors.volunteerHelp}>
              <MultiSelectChips
                options={VOLUNTEER_HELP_OPTIONS}
                selected={data.volunteerHelp}
                onToggle={(value) => toggleInArray("volunteerHelp", value)}
              />
            </FieldBlock>

            {isFieldVisible({ field: "volunteerHelp", includes: "other" }, data) && (
              <FieldBlock
                label="Please specify"
                htmlFor="volunteerHelpOther"
                error={errors.volunteerHelpOther}
              >
                <Input
                  id="volunteerHelpOther"
                  value={data.volunteerHelpOther}
                  onChange={(e) => updateField("volunteerHelpOther", e.target.value)}
                  onBlur={() => onFieldBlur("volunteerHelpOther")}
                />
              </FieldBlock>
            )}
          </>
        )}

        {step.id === "presence_and_declarations" && (
          <>
            <FieldBlock label="Website" htmlFor="website" error={errors.website}>
              <Input
                id="website"
                type="url"
                value={data.website}
                onChange={(e) => updateField("website", e.target.value)}
                onBlur={() => onFieldBlur("website")}
              />
            </FieldBlock>

            <FieldBlock label="Facebook" htmlFor="facebook" error={errors.facebook}>
              <Input
                id="facebook"
                type="url"
                value={data.facebook}
                onChange={(e) => updateField("facebook", e.target.value)}
                onBlur={() => onFieldBlur("facebook")}
              />
            </FieldBlock>

            <FieldBlock label="Instagram" htmlFor="instagram" error={errors.instagram}>
              <Input
                id="instagram"
                type="url"
                value={data.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
                onBlur={() => onFieldBlur("instagram")}
              />
            </FieldBlock>

            <FieldBlock label="YouTube" htmlFor="youtube" error={errors.youtube}>
              <Input
                id="youtube"
                type="url"
                value={data.youtube}
                onChange={(e) => updateField("youtube", e.target.value)}
                onBlur={() => onFieldBlur("youtube")}
              />
            </FieldBlock>

            <FieldBlock label="Anything else you want to tell?" htmlFor="additionalNotes">
              <Textarea
                id="additionalNotes"
                value={data.additionalNotes}
                onChange={(e) => updateField("additionalNotes", e.target.value)}
              />
            </FieldBlock>

            <Card className="rounded-2xl border-none py-5 shadow-sm ring-1 ring-border sm:py-6">
              <CardContent className="space-y-4">
                <p className="font-heading text-base font-semibold text-foreground">
                  Before you submit
                </p>
                {DECLARATIONS.map((declaration) => (
                  <label key={declaration.key} className="flex items-start gap-3">
                    <Checkbox
                      id={`decl-${declaration.key}`}
                      checked={data.declarations[declaration.key] ?? false}
                      onCheckedChange={(checked) =>
                        updateField("declarations", {
                          ...data.declarations,
                          [declaration.key]: checked === true,
                        })
                      }
                      className="mt-0.5"
                    />
                    <span className="text-sm text-foreground">
                      {declaration.text}
                      {declaration.key === "consent_storage_and_display" && (
                        <>
                          {" "}
                          Read our{" "}
                          <Link href="/privacy" target="_blank" className="underline underline-offset-2">
                            privacy policy
                          </Link>
                          .
                        </>
                      )}
                    </span>
                  </label>
                ))}
                <FieldError message={errors.declarations} />
              </CardContent>
            </Card>
          </>
        )}
        </div>

        {submitError && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={goBack}
              disabled={submitting}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {isLastStep ? (
            <Button type="button" size="lg" onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={goNext} className="flex-1">
              Next
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your answers are saved on this device as you go.
        </p>
      </div>
    </main>
  );
}
