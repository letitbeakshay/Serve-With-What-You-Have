"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, loginWithPasswordAction, type LoginState } from "./actions";

const initialState: LoginState = null;

function PinForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin" className="text-base font-medium">
          Enter PIN
        </Label>
        <Input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={12}
          className="h-14 text-center text-2xl tracking-[0.3em]"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="h-12 w-full text-base">
        {isPending ? "Checking…" : "Enter"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [state, formAction, isPending] = useActionState(loginWithPasswordAction, initialState);

  return (
    <form action={formAction} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" autoFocus required className="h-12" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="h-12 w-full text-base">
        {isPending ? "Checking…" : "Log in"}
      </Button>
    </form>
  );
}

export function LoginForm() {
  const [mode, setMode] = useState<"password" | "pin">("password");

  return (
    <div className="w-full">
      {mode === "password" ? <PasswordForm /> : <PinForm />}
      <button
        type="button"
        onClick={() => setMode(mode === "password" ? "pin" : "password")}
        className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {mode === "password" ? "Log in with owner PIN instead" : "Log in with email and password instead"}
      </button>
    </div>
  );
}
