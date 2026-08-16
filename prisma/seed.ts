import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // A single test form to exercise the public form and admin panel while
  // building. Real forms get created from the admin panel once step 6 exists.
  await prisma.form.upsert({
    where: { slug: "test" },
    update: {},
    create: {
      name: "Test Form",
      slug: "test",
      status: "OPEN",
    },
  });
  console.log("Seeded: /f/test");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
