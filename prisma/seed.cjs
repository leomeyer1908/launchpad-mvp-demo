// prisma/seed.cjs
const { PrismaClient, ProjectStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "founder@example.com";

  // 1) Ensure demo user exists
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      // You can add name, image, etc. if you like:
      // name: "Demo Founder",
    },
  });

  console.log(`Using demo user: ${user.id} (${user.email})`);

  // 2) Check if this user already has projects
  const existingProjectsCount = await prisma.project.count({
    where: { userId: user.id },
  });

  if (existingProjectsCount > 0) {
    console.log(
      `User already has ${existingProjectsCount} project(s). Skipping project seed.`
    );
    return;
  }

  // 3) Seed the 3 demo projects
  const projectsData = [
    {
      name: "Analytics Dashboard",
      description: "Core analytics product for tracking key metrics.",
      mrr: 1200, // $1,200
      activeUsers: 85,
      status: ProjectStatus.ACTIVE,
    },
    {
      name: "Internal Tools Revamp",
      description: "Revamping internal admin tools and workflows.",
      mrr: 600, // $600
      activeUsers: 40,
      status: ProjectStatus.TRIALING,
    },
    {
      name: "Client Portal (Legacy)",
      description: "Legacy client-facing portal still in limited use.",
      mrr: 300, // $300
      activeUsers: 20,
      status: ProjectStatus.PAUSED,
    },
  ];

  const created = await prisma.project.createMany({
    data: projectsData.map((p) => ({
      ...p,
      userId: user.id,
    })),
  });

  console.log(`Seeded ${created.count} projects for ${email}.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

