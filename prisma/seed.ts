import { DocumentStatus, PageSize, PrismaClient } from '@prisma/client';
import { customersData } from './data/customer';
import { UserRole } from '@prisma/client';
import { spsoData } from './data/spso';
import { printerLocationsData } from './data/printerLocation';
import { printersData } from './data/printer';
import { adminData } from './data/admin';
import { purchaseLogData } from './data/purchaseLog';
import { defaultConfigurationData } from './data/defaultConfig';
import { documentData } from './data/documentData';

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
      const location = await prisma.printerLocation.findFirst({
        where: {
          campusName: printer.campusName,
          buildingName: printer.buildingName,
          roomName: printer.roomName,
        },
      });

      if (location) {
        await prisma.printer.create({
          data: {
            brandName: printer.brandName,
            model: printer.model,
            locationId: location.id,
            shortDescription: printer.shortDescription,
            printerStatus: printer.printerStatus,
            isInProgress: printer.isInProgress,
          },
        });
      }
    }),
  );

  await Promise.all(
    purchaseLogData.map(async (purchaseLog) => {
      // Tìm `id` của Customer dựa trên `idInSchool`
      const customer = await prisma.customer.findFirst({
        where: { idInSchool: purchaseLog.customerId },
      });

      // Nếu không tìm thấy Customer, bỏ qua hoặc xử lý lỗi
      if (!customer) {
        console.error(
          `Customer with idInSchool ${purchaseLog.customerId} not found`,
        );
        return;
      }

      // Sử dụng `id` của Customer để tạo bản ghi `PurchaseLog`
      await prisma.purchaseLog.create({
        data: {
          customerId: customer.id, // Sử dụng `id` của Customer
          orderId: purchaseLog.orderId,
          transactionTime: purchaseLog.transactionTime,
          numberOfPage: purchaseLog.numberOfPage,
          price: purchaseLog.price,
          purchaseStatus: purchaseLog.purchaseStatus,
        },
      });
    }),
  );

  await Promise.all(
    defaultConfigurationData.map(async (defaultConfig) => {
      const cur_email = 'viet.trankhmtbk22@hcmut.edu.vn';
      const spso = await prisma.spso.findFirst({
        where: { user: { email: cur_email } },
      });

      // Nếu không tìm thấy SPSO, bỏ qua hoặc xử lý lỗi
      if (!spso) {
        console.error(`SPSO with email ${cur_email} not found`);
        return;
      }

      await prisma.defaultConfiguration.create({
        data: {
          defaultPage: defaultConfig.defaultPage,
          permittedFileTypes: defaultConfig.permittedFileTypes,
          firstTermGivenDate: defaultConfig.firstTermGivenDate,
          secondTermGivenDate: defaultConfig.secondTermGivenDate,
          thirdTermGivenDate: defaultConfig.thirdTermGivenDate,
          isLastConfiguration: defaultConfig.isLastConfiguration,
          spsoId: spso.id,
        },
      });
    }),
  );

  await Promise.all(
    documentData.map(async (documentData) => {
      const customer = await prisma.customer.findFirst({
        where: { idInSchool: documentData.customerId },
      });

      if (!customer) {
        console.error(
          `Customer with idInSchool ${documentData.customerId} not found`,
        );
        return;
      }

      // Tính toán `totalCostPage` dựa trên `pageSize`, `pageToPrint`, `numOfCop`
      const totalCostPage =
        (documentData.pageSize === PageSize.A4 ? 1 : 2) *
        documentData.pageToPrint.length *
        documentData.numOfCop;

      await prisma.document.create({
        data: {
          customerId: customer.id,
          fileName: documentData.fileName,
          fileType: documentData.fileType,
          totalCostPage: totalCostPage,
          printSideType: documentData.printSideType,
          pageSize: documentData.pageSize,
          pageToPrint: documentData.pageToPrint,
          numOfCop: documentData.numOfCop,
          documentStatus: DocumentStatus.COMPLETED,
          fileContent: Buffer.from(documentData.fileContent, 'base64'),
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
