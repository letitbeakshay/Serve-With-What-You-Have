import { AddDonorForm } from "./add-donor-form";

export const metadata = {
  title: "Log a Donation | Serve With What You Have",
  robots: { index: false, follow: false },
};

export default function AddDonorPage() {
  return <AddDonorForm />;
}
