import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create initial routes
  const routes = [
    {
      routeId: 'R001',
      year: 2025,
      ghgIntensity: 95.5,
      vesselType: 'Container',
      fuelType: 'HFO',
      fuelConsumption: 1200,
      distance: 15000,
      totalEmissions: 4750,
      isBaseline: true
    },
    {
      routeId: 'R002',
      year: 2025,
      ghgIntensity: 85.2,
      vesselType: 'Container',
      fuelType: 'LNG',
      fuelConsumption: 1100,
      distance: 14500,
      totalEmissions: 3900
    }
  ];

  for (const route of routes) {
    await prisma.route.create({
      data: route
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });