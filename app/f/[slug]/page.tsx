import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PublicForm } from "./public-form";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await prisma.form.findUnique({ where: { slug } });

  if (!form) {
    notFound();
  }

  if (form.status === "CLOSED") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">{form.name}</h1>
        <p className="mt-4 text-muted-foreground">
          {form.closedMessage ??
            "This form isn't taking responses right now. Please check back another time."}
        </p>
      </main>
    );
  }

  return <PublicForm formSlug={form.slug} formName={form.name} />;
}
