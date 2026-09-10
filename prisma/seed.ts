import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const soumya = await prisma.user.upsert({
    where: {
      email: "tiwarisoumya111@gmail.com",
    },
    update: {
      name: "Soumya Tiwari",
    },
    create: {
      name: "Soumya Tiwari",
      email: "tiwarisoumya111@gmail.com",
    },
  });

  const alex = await prisma.user.upsert({
    where: {
      email: "alex.morgan@example.com",
    },
    update: {
      name: "Alex Morgan",
    },
    create: {
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
    },
  });

  console.log("Seeded users:");
  console.log(`- ${soumya.name} (${soumya.email})`);
  console.log(`- ${alex.name} (${alex.email})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
