import { DonationEntryApp } from "./donation-entry-app";

export const metadata = {
  title: "Donation Entry | Serve With What You Have",
  robots: { index: false, follow: false },
};

export default function DonationEntryPage() {
  return <DonationEntryApp />;
}
