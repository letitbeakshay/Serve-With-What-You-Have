import { Label } from "@/components/ui/label";

export function AnonymousToggle({
  idPrefix = "",
  checked,
  onChange,
}: {
  idPrefix?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = `${idPrefix}anonymous`;
  return (
    <div className="flex items-center gap-2 sm:col-span-2">
      <input
        id={id}
        name="anonymous"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Label htmlFor={id} className="font-normal">
        Donor didn&apos;t want to give their name or number -- log this as Anonymous
      </Label>
    </div>
  );
}
