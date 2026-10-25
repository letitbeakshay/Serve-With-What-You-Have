// Ranked horizontal bars, one hue (sequential by magnitude) -- garment type
// is the category, quantity is the one measure, so color identity across
// bars would say nothing a sorted list doesn't already say better.
export function GarmentBreakdownBars({ data }: { data: Array<[string, number]> }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing logged yet for this period.</p>;
  }

  const max = Math.max(...data.map(([, qty]) => qty));

  return (
    <div className="space-y-2.5">
      {data.map(([garmentType, qty]) => (
        <div key={garmentType} className="flex items-center gap-3">
          <p className="w-32 shrink-0 truncate text-sm text-foreground sm:w-40">{garmentType}</p>
          <div className="relative h-5 min-w-0 flex-1 rounded bg-muted">
            <div
              className="h-5 rounded-r-sm bg-primary"
              style={{ width: `${Math.max((qty / max) * 100, 3)}%` }}
            />
          </div>
          <p className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-foreground">{qty}</p>
        </div>
      ))}
    </div>
  );
}
