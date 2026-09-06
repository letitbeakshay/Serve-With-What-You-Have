"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_CODES, DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/field-config/v2";
import { submitSimpleResponse, type SimpleSubmitState } from "./actions-v2";

const COUNTRY_CODE_SELECT_ITEMS = COUNTRY_CODES.map((code) => ({ value: code.value, label: code.value }));

const initialState: SimpleSubmitState = { status: "idle" };

function FieldBlock({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function SimpleForm({ formId, formName }: { formId: string; formName: string }) {
  const action = submitSimpleResponse.bind(null, formId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6">
        <Card className="w-full max-w-lg rounded-3xl border-none py-10 text-center shadow-md ring-1 ring-border sm:py-14">
          <CardContent className="flex flex-col items-center px-6 sm:px-10">
            <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Thank you</h1>
            <p className="mt-4 text-muted-foreground">
              We have your details. Someone from Serve With What You Have will call you to confirm
              everything.
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
          <p className="text-sm font-medium text-primary">{formName}</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            A few details to get started
          </h1>
          <p className="mt-3 text-muted-foreground">
            Just this much for now. We&apos;ll call you to fill in the rest.
          </p>
          <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
        </header>

        <form action={formAction} className="space-y-4">
          <Card className="rounded-2xl border-none py-5 shadow-sm ring-1 ring-border sm:py-6">
            <CardContent className="space-y-4">
              <FieldBlock label="Your name" htmlFor="contactName" error={fieldErrors?.contactName}>
                <Input id="contactName" name="contactName" autoComplete="name" />
              </FieldBlock>

              <FieldBlock
                label="Your phone number"
                htmlFor="phone"
                error={fieldErrors?.phone}
                hint="WhatsApp preferred, 10 digits."
              >
                <div className="flex gap-2">
                  <Select name="phoneCountryCode" defaultValue={DEFAULT_PHONE_COUNTRY_CODE} items={COUNTRY_CODE_SELECT_ITEMS}>
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
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="flex-1"
                    autoComplete="tel-national"
                  />
                </div>
              </FieldBlock>

              <FieldBlock label="Your association name" htmlFor="orgName" error={fieldErrors?.orgName}>
                <Input id="orgName" name="orgName" />
              </FieldBlock>

              <FieldBlock label="Where it is located" htmlFor="location" error={fieldErrors?.location} hint="City and state is enough.">
                <Input id="location" name="location" placeholder="e.g. Coimbatore, Tamil Nadu" />
              </FieldBlock>

              <FieldBlock label="How do you know us?" htmlFor="referralSource" error={fieldErrors?.referralSource}>
                <Textarea id="referralSource" name="referralSource" className="min-h-20" />
              </FieldBlock>
            </CardContent>
          </Card>

          {state.status === "error" && state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending} className="h-12 w-full text-base">
            {isPending ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </div>
    </main>
  );
}
