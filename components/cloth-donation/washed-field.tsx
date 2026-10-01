import { Label } from "@/components/ui/label";

// Plain native radios rather than the shadcn RadioGroup -- these forms post
// through a server action via FormData, and native inputs are the simplest
// way to guarantee the value actually shows up there.
export function WashedField({
  idPrefix = "",
  defaultWashed,
}: {
  idPrefix?: string;
  /** Omit for a blank new-entry form. Pass true/false/null (don't know) when editing. */
  defaultWashed?: boolean | null;
}) {
  return (
    <div className="space-y-2">
      <Label>Washed or unwashed</Label>
      <div className="flex flex-wrap gap-4 pt-1">
        <label htmlFor={`${idPrefix}washed-yes`} className="flex items-center gap-2 text-sm text-foreground">
          <input
            id={`${idPrefix}washed-yes`}
            type="radio"
            name="washed"
            value="washed"
            required
            defaultChecked={defaultWashed === true}
          />
          Washed
        </label>
        <label htmlFor={`${idPrefix}washed-no`} className="flex items-center gap-2 text-sm text-foreground">
          <input
            id={`${idPrefix}washed-no`}
            type="radio"
            name="washed"
            value="unwashed"
            required
            defaultChecked={defaultWashed === false}
          />
          Unwashed
        </label>
        <label htmlFor={`${idPrefix}washed-dont-know`} className="flex items-center gap-2 text-sm text-foreground">
          <input
            id={`${idPrefix}washed-dont-know`}
            type="radio"
            name="washed"
            value="dont_know"
            required
            defaultChecked={defaultWashed === null}
          />
          Don&apos;t know
        </label>
      </div>
    </div>
  );
}
