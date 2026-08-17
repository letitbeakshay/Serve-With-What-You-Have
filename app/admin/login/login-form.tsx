"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = null;

export function LoginForm() {
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
