"use client";

import { Button } from "@/components/ui/button";

// A plain <form action={serverAction}> submit button, with one addition: a
// confirm() dialog gates the submit, so a stray click can't delete a row.
// Used by every "Remove" button across the admin panel.
export function ConfirmRemoveButton({
  action,
  id,
  confirmMessage = "Remove this entry? This can't be undone.",
  label = "Remove",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm">
        {label}
      </Button>
    </form>
  );
}
