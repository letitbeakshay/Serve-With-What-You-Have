// Shared between the admin "Log a donation" form and the public /add-donor
// link, so a donor logged either way is validated the same way.

export type DonationInput = {
  donorName: string;
  phone: string;
  email: string | null;
  donatedAt: Date;
  // true = washed, false = unwashed, null = "don't know"
  washed: boolean | null;
  collectionPoint: string | null;
  location: string | null;
};

export type ParseDonationResult = { error: string } | { data: DonationInput };

const WASHED_VALUES = ["washed", "unwashed", "dont_know"] as const;

export function parseDonationFormData(formData: FormData): ParseDonationResult {
  const donorName = String(formData.get("donorName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const donatedAtRaw = String(formData.get("donatedAt") ?? "").trim();
  const washedRaw = String(formData.get("washed") ?? "").trim();
  const collectionPoint = String(formData.get("collectionPoint") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!donorName) return { error: "Please enter the donor's name." };
  if (!phone) return { error: "Please enter a mobile number." };
  if (!donatedAtRaw) return { error: "Please enter the date they donated." };
  if (!(WASHED_VALUES as readonly string[]).includes(washedRaw)) {
    return { error: "Please say whether the clothes are washed, unwashed, or you don't know." };
  }

  // Stored at midday UTC rather than midnight so the calendar date this
  // represents never shifts by a day when displayed from a different
  // timezone than the one it was entered in.
  const donatedAt = new Date(`${donatedAtRaw}T12:00:00.000Z`);
  if (Number.isNaN(donatedAt.getTime())) return { error: "That date doesn't look right." };

  return {
    data: {
      donorName,
      phone,
      email: email || null,
      donatedAt,
      washed: washedRaw === "dont_know" ? null : washedRaw === "washed",
      collectionPoint: collectionPoint || null,
      location: location || null,
    },
  };
}
