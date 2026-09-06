import type { GaveData } from "@/lib/stories";

const SQUARE_CLASS: Record<GaveData["squares"][number], string> = {
  given: "on",
  money: "off",
  unused: "",
};

export function GaveGrid({ gave }: { gave: GaveData }) {
  return (
    <div className="gave rv">
      <h3>{gave.label}</h3>
      <p className="sub">{gave.subtext}</p>
      <div className="gave-grid" aria-hidden="true">
        {gave.squares.map((state, index) => (
          <i key={index} className={SQUARE_CLASS[state] || undefined} />
        ))}
      </div>
      <div className="gave-key">
        <span>
          <em className="out" />
          Money, not needed
        </span>
        <span>
          <em />
          {gave.primaryTag}, what they gave
        </span>
        <span>
          <em className="dim" />
          Still in their hands
        </span>
      </div>
    </div>
  );
}
