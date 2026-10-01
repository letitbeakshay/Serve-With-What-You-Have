"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-session";

export async function deleteInterest(formData: FormData) {
  if (!(await getCurrentAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.interestResponse.deleteMany({ where: { id } });
  revalidatePath("/admin/other-interests");
}
