import { PrismaClient } from '@prisma/client';
import { customersData } from './data/customer';
import { UserRole } from '@prisma/client';
import { spsoData } from './data/spso';
import { printerLocationsData } from './data/printerLocation';
import { printersData } from './data/printer';
import { adminData } from './data/admin';

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    adminData.map(async (admin) => {
      await prisma.user.create({
        data: {
          email: admin.email,
          role: UserRole.ADMIN,
          familyName: admin.familyName,
          givenName: admin.givenName,
        },
      });
    }),
  );

  await Promise.all(
    customersData.map(async (customer) => {
      await prisma.user.create({
        data: {
          email: customer.email,
          role: UserRole.CUSTOMER,
          familyName: customer.familyName,
          givenName: customer.givenName,
          customer: {
            create: {
              idInSchool: customer.idInSchool,
              currentPage: customer.currentPage,
            },
          },
        },
      });
    }),
  );

  await Promise.all(
    spsoData.map(async (spso) => {
      await prisma.user.create({
        data: {
          email: spso.email,
          role: UserRole.SPSO,
          familyName: spso.familyName,
          givenName: spso.givenName,
          spso: {
            create: {
              phoneNumber: spso.phoneNumber,
            },
          },
        },
      });
    }),
  );

  await Promise.all(
    printerLocationsData.map(async (printerLocation) => {
      await prisma.printerLocation.create({
        data: {
          id: printerLocation.id,
          campusName: printerLocation.campusName,
          buildingName: printerLocation.buildingName,
          roomName: printerLocation.roomName,
          campusAdress: printerLocation.campusAdress,
          hotline: printerLocation.hotline,
          description: printerLocation.description,
        },
      });
    }),
  );

  await Promise.all(
    printersData.map(async (printer) => {
      await prisma.printer.create({
        data: {
          id: printer.id,
          brandName: printer.brandName,
          model: printer.model,
          locationId: printer.locationId,
          shortDescription: printer.shortDescription,
          printerStatus: printer.printerStatus,
          isInProgress: printer.isInProgress,
        },
      });
    }),
  );
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
