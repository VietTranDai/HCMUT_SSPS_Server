import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, rgb } from 'pdf-lib'; // Import pdf-lib
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SPSOReportService {
  constructor(private prisma: PrismaService) {}

  // Hàm lưu báo cáo vào database
  private async saveReport(
    title: string,
    pdfBuffer: Buffer,
    reportType: 'MONTHLY' | 'YEARLY',
  ) {
    await this.prisma.periodicReport.create({
      data: {
        title,
        reportContent: pdfBuffer, // Lưu nội dung PDF vào database
        reportType,
      },
    });
  }

  // Tự động tạo báo cáo hàng tháng
  @Cron('59 23 28 * *') // Chạy vào cuối tháng
  async generateMonthlyReport() {
    const now = new Date();
    console.log('Generating monthly report... ', now);

    // Tạo nội dung cho file PDF
    const pdfBuffer = await this.generateMonthlyPDFReport(
      now.getMonth() + 1,
      now.getFullYear(),
      now.toISOString(),
    );

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Lưu báo cáo vào database
    await this.saveReport(
      `Monthly_Report_${month}_${year}.pdf`,
      pdfBuffer,
      'MONTHLY',
    );
  }

  // Tự động tạo báo cáo hàng năm
  @Cron('59 23 31 12 *') // Chạy vào cuối năm
  async generateYearlyReport() {
    const now = new Date();
    console.log('Generating yearly report... ', now);

    // Tạo nội dung cho file PDF
    const pdfBuffer = await this.generateYearlyPDFReport(
      now.getFullYear(),
      now.toISOString(),
    );

    const year = now.getFullYear();

    // Lưu báo cáo vào database
    await this.saveReport(`Yearly_Report_${year}.pdf`, pdfBuffer, 'YEARLY');
  }

  // Lấy nội dung báo cáo dưới dạng Base64
  async getReportContentAsBase64(reportId: string): Promise<string> {
    const report = await this.prisma.periodicReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new BadRequestException('Report not found');
    }

    return report.reportContent.toString('base64');
  }

  // Lấy danh sách tất cả báo cáo
  async getAllReports() {
    return this.prisma.periodicReport.findMany({
      select: {
        id: true,
        createdAt: true,
        title: true,
        reportType: true,
      },
    });
  }

  async getReportById(reportId: string) {
    return this.prisma.periodicReport.findUnique({
      where: { id: reportId },
    });
  }

  // Hàm tạo báo cáo cho một tháng bất kỳ
  async generateReportForMonth(month: number, year: number): Promise<string> {
    // Kiểm tra tháng và năm hợp lệ
    if (month < 1 || month > 12 || year < 1900) {
      throw new BadRequestException('Invalid month or year');
    }

    console.log('Checking report for month: ', month, year);
    const now = new Date();
    // Tạo file PDF và trả về nội dung Base64
    const pdfBuffer = await this.generateMonthlyPDFReport(
      month,
      year,
      now.toISOString(),
    );

    const report = await this.prisma.periodicReport.findFirst({
      where: {
        title: `Monthly_Report_${month}_${year}.pdf`,
      },
    });

    if (!report) {
      await this.saveReport(
        `Monthly_Report_${month}_${year}.pdf`,
        pdfBuffer,
        'MONTHLY',
      );
    } else {
      // Nếu báo cáo đã tồn tại, cập nhật nội dung mới
      await this.prisma.periodicReport.update({
        where: {
          id: report.id,
        },
        data: {
          reportContent: pdfBuffer,
        },
      });
    }
    return pdfBuffer.toString('base64'); // Chuyển sang Base64 để trả về
  }

  // Hàm tạo báo cáo cho một năm bất kỳ
  async generateReportForYear(year: number): Promise<string> {
    // Kiểm tra năm hợp lệ
    if (year < 1900) {
      throw new BadRequestException('Invalid year');
    }

    const now = new Date();
    // Tạo file PDF và trả về nội dung Base64
    const pdfBuffer = await this.generateYearlyPDFReport(
      year,
      now.toISOString(),
    );

    const report = await this.prisma.periodicReport.findFirst({
      where: {
        title: `Yearly_Report_${year}.pdf`,
      },
    });

    if (!report) {
      await this.saveReport(`Yearly_Report_${year}.pdf`, pdfBuffer, 'YEARLY');
    } else {
      // Nếu báo cáo đã tồn tại, cập nhật nội dung mới
      await this.prisma.periodicReport.update({
        where: {
          id: report.id,
        },
        data: {
          reportContent: pdfBuffer,
        },
      });
    }

    return pdfBuffer.toString('base64'); // Chuyển sang Base64 để trả về
  }

  // Hàm tạo báo cáo hàng tháng
  async generateFullReportByMonth(month: number, year: number) {
    const campusNames = ['CS1', 'CS2']; // Các cơ sở
    const reports = [];

    for (const campusName of campusNames) {
      const report = await this.generateReportByCampus(campusName, month, year);
      reports.push(report);
    }

    return reports;
  }

  async generateReportByCampus(
    campusName: string,
    month: number,
    year: number,
  ) {
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0); // Ngày cuối tháng

    const locations = await this.prisma.printerLocation.findMany({
      where: {
        campusName,
      },
      include: {
        Printer: true,
      },
    });

    let campusReport = {
      campusName,
      totalRevenue: 0,
      totalCustomers: 0,
      totalUsage: 0, // Tổng số lần sử dụng trong campus
      locations: [] as any[],
    };

    for (const location of locations) {
      let locationReport = {
        location: `${location.buildingName} - ${location.roomName}`,
        totalUsage: 0, // Số lần sử dụng của location
        totalRevenue: 0, // Doanh thu của địa điểm này
        revenueContributionRate: 0, // Tỷ lệ đóng góp doanh thu của địa điểm
        printers: [] as any[],
      };

      for (const printer of location.Printer) {
        const usageStats = await this.prisma.printServiceLog.groupBy({
          by: ['serviceStatus'],
          _count: {
            serviceStatus: true,
          },
          where: {
            printerId: printer.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const completedCount =
          usageStats.find((stat) => stat.serviceStatus === 'COMPLETED')?._count
            .serviceStatus || 0;

        const failedCount =
          usageStats.find((stat) => stat.serviceStatus === 'FAILED')?._count
            .serviceStatus || 0;

        const totalCount = completedCount + failedCount;

        const successRate =
          totalCount > 0 ? (completedCount / totalCount) * 100 : 0; // Tỷ lệ thành công (%)

        const revenueData = await this.prisma.printServiceLog.aggregate({
          _sum: {
            totalPageCost: true,
          },
          where: {
            printerId: printer.id,
            serviceStatus: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        const printerRevenue = (revenueData._sum.totalPageCost || 0) * 200;

        // Cập nhật báo cáo máy in
        locationReport.printers.push({
          printerId: printer.id,
          completedCount,
          failedCount,
          revenue: formatCurrency(printerRevenue), // Định dạng tiền tệ
          successRate: successRate.toFixed(2),
        });

        // Cập nhật số lần sử dụng và doanh thu
        locationReport.totalUsage += totalCount;
        locationReport.totalRevenue += printerRevenue;
        campusReport.totalUsage += totalCount; // Cộng dồn vào tổng số lần sử dụng trong campus
        campusReport.totalRevenue += printerRevenue;
      }

      locationReport.revenueContributionRate =
        campusReport.totalRevenue > 0
          ? parseFloat(
              (
                (locationReport.totalRevenue / campusReport.totalRevenue) *
                100
              ).toFixed(2),
            )
          : 0;

      campusReport.locations.push(locationReport);
    }

    const totalCustomersGroup = await this.prisma.printServiceLog.groupBy({
      by: ['customerId'],
      where: {
        printer: {
          location: {
            campusName,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    campusReport.totalCustomers = totalCustomersGroup.length;

    return campusReport;
  }

  private async generateMonthlyPDFReport(
    month: number,
    year: number,
    timestamp: string,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    // Hàm thêm trang mới
    const addNewPage = () => {
      const page = pdfDoc.addPage([600, 800]);
      return page;
    };

    // Thêm trang đầu tiên
    let page = addNewPage();
    const { width, height } = page.getSize();

    // Định dạng timestamp thành dd-mm-yyyy
    const formattedTimestamp = new Date(timestamp).toLocaleDateString('vi-VN');

    // Thêm logo vào góc trên trái (nhỏ hơn gấp 40 lần)
    const logoPath = path.join('./src/spso/spso_report/hcmut.png'); // Đường dẫn đến logo
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes); // Nhúng logo (PNG)
    const logoDims = logoImage.scale(0.025); // Giảm kích thước logo gấp 40 lần

    // Vẽ logo và tiêu đề
    const logoX = 30;
    const textX = 75 + logoDims.width / 2 - 75;

    page.drawImage(logoImage, {
      x: logoX,
      y: height - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });

    page.drawText(`Generated on: ${formattedTimestamp}`, {
      x: textX,
      y: height - 5 - logoDims.height,
      size: 5,
    });

    const title = `Monthly Report for SSPS System - ${month}/${year}`;
    const titleWidth = 10 * title.length;
    const titleX = (width - titleWidth) / 2;

    page.drawText(title, {
      x: titleX,
      y: height - 40 - logoDims.height,
      size: 20,
      color: rgb(0, 0.53, 0.71),
    });

    const fullReport = await this.generateFullReportByMonth(month, year);

    let startY = height - 80 - logoDims.height;

    // Vẽ bảng dữ liệu
    for (const campusReport of fullReport) {
      if (startY < 50) {
        page = addNewPage();
        startY = height - 50; // Reset vị trí cho trang mới
      }

      page.drawText(`Campus: ${campusReport.campusName}`, {
        x: 50,
        y: startY,
        size: 14,
        color: rgb(0, 0, 1),
      });
      startY -= 20;

      page.drawText(
        `Total Revenue: ${formatCurrency(campusReport.totalRevenue)}`,
        {
          x: 70,
          y: startY,
          size: 12,
        },
      );
      startY -= 20;

      page.drawText(`Total Customers: ${campusReport.totalCustomers}`, {
        x: 70,
        y: startY,
        size: 12,
      });
      startY -= 20;

      for (const location of campusReport.locations) {
        if (startY < 50) {
          page = addNewPage();
          startY = height - 50;
        }

        page.drawText(`Location: ${location.location}`, {
          x: 90,
          y: startY,
          size: 10,
          color: rgb(0.5, 0.5, 0.5),
        });
        startY -= 20;

        const revenueContributionRate =
          campusReport.totalRevenue > 0
            ? parseFloat(
                (
                  (location.totalRevenue / campusReport.totalRevenue) *
                  100
                ).toFixed(2),
              )
            : 0;

        const usageRate =
          campusReport.totalUsage > 0
            ? parseFloat(
                ((location.totalUsage / campusReport.totalUsage) * 100).toFixed(
                  2,
                ),
              )
            : 0;

        page.drawText(
          `Total Usage: ${location.totalUsage}. Usage Rate: ${usageRate}%`,
          {
            x: 110,
            y: startY,
            size: 10,
          },
        );
        startY -= 20;

        page.drawText(
          `Total Revenue: ${formatCurrency(location.totalRevenue)}. Revenue Contribution Rate: ${revenueContributionRate}%`,
          {
            x: 110,
            y: startY,
            size: 10,
          },
        );
        startY -= 20;

        for (const printer of location.printers) {
          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(`Printer ${printer.printerId}:`, {
            x: 130,
            y: startY,
            size: 10,
          });
          startY -= 20;

          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(
            `Completed ${printer.completedCount}, Failed ${printer.failedCount}`,
            { x: 150, y: startY, size: 10 },
          );
          startY -= 20;

          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(
            `Revenue ${printer.revenue} VND, Success Rate: ${printer.successRate}%`,
            { x: 150, y: startY, size: 10 },
          );
          startY -= 20;
        }
      }

      startY -= 20;
    }

    // Xuất file PDF thành buffer
    const pdfBytes = await pdfDoc.save();

    const monthly_report_folder = path.join(
      './src/spso/spso_report/monthly_reports_folder/',
    );

    ensureFolderExists(monthly_report_folder);

    const pdfFilePath = path.join(
      monthly_report_folder,
      `Monthly_Report_${month}_${year}.pdf`,
    );

    // Lưu file PDF
    fs.writeFileSync(pdfFilePath, pdfBytes);

    return Buffer.from(pdfBytes);
  }

  // Hàm tạo báo cáo hàng năm
  async generateFullReportByYear(year: number) {
    const campusNames = ['CS1', 'CS2']; // Các cơ sở
    const reports = [];

    for (const campusName of campusNames) {
      const report = await this.generateReportByCampusByYear(campusName, year);
      reports.push(report);
    }

    return reports;
  }

  async generateReportByCampusByYear(campusName: string, year: number) {
    // Ngày đầu năm
    const startDate = new Date(year, 0, 1);
    // Ngày cuối năm
    const endDate = new Date(year, 11, 31);

    const locations = await this.prisma.printerLocation.findMany({
      where: {
        campusName,
      },
      include: {
        Printer: true,
      },
    });

    let campusReport = {
      campusName,
      totalRevenue: 0,
      totalCustomers: 0,
      totalUsage: 0, // Tổng số lần sử dụng trong campus
      locations: [] as any[],
    };

    for (const location of locations) {
      let locationReport = {
        location: `${location.buildingName} - ${location.roomName}`,
        totalUsage: 0, // Số lần sử dụng của location
        totalRevenue: 0, // Doanh thu của địa điểm này
        revenueContributionRate: 0, // Tỷ lệ đóng góp doanh thu của địa điểm
        printers: [] as any[],
      };

      for (const printer of location.Printer) {
        const usageStats = await this.prisma.printServiceLog.groupBy({
          by: ['serviceStatus'],
          _count: {
            serviceStatus: true,
          },
          where: {
            printerId: printer.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const completedCount =
          usageStats.find((stat) => stat.serviceStatus === 'COMPLETED')?._count
            .serviceStatus || 0;

        const failedCount =
          usageStats.find((stat) => stat.serviceStatus === 'FAILED')?._count
            .serviceStatus || 0;

        const totalCount = completedCount + failedCount;

        const successRate =
          totalCount > 0 ? (completedCount / totalCount) * 100 : 0; // Tỷ lệ thành công (%)

        const revenueData = await this.prisma.printServiceLog.aggregate({
          _sum: {
            totalPageCost: true,
          },
          where: {
            printerId: printer.id,
            serviceStatus: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        const printerRevenue = (revenueData._sum.totalPageCost || 0) * 200;

        // Cập nhật báo cáo máy in
        locationReport.printers.push({
          printerId: printer.id,
          completedCount,
          failedCount,
          revenue: formatCurrency(printerRevenue), // Định dạng tiền tệ
          successRate: successRate.toFixed(2),
        });

        // Cập nhật số lần sử dụng và doanh thu
        locationReport.totalUsage += totalCount;
        locationReport.totalRevenue += printerRevenue;
        campusReport.totalUsage += totalCount; // Cộng dồn vào tổng số lần sử dụng trong campus
        campusReport.totalRevenue += printerRevenue;
      }

      locationReport.revenueContributionRate =
        campusReport.totalRevenue > 0
          ? parseFloat(
              (
                (locationReport.totalRevenue / campusReport.totalRevenue) *
                100
              ).toFixed(2),
            )
          : 0;

      campusReport.locations.push(locationReport);
    }

    const totalCustomersGroup = await this.prisma.printServiceLog.groupBy({
      by: ['customerId'],
      where: {
        printer: {
          location: {
            campusName,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    campusReport.totalCustomers = totalCustomersGroup.length;

    return campusReport;
  }

  private async generateYearlyPDFReport(
    year: number,
    timestamp: string,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    // Hàm thêm trang mới
    const addNewPage = () => {
      const page = pdfDoc.addPage([600, 800]);
      return page;
    };

    // Thêm trang đầu tiên
    let page = addNewPage();
    const { width, height } = page.getSize();

    // Định dạng timestamp thành dd-mm-yyyy
    const formattedTimestamp = new Date(timestamp).toLocaleDateString('vi-VN');

    // Thêm logo vào góc trên trái (nhỏ hơn gấp 40 lần)
    const logoPath = path.join('./src/spso/spso_report/hcmut.png'); // Đường dẫn đến logo
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes); // Nhúng logo (PNG)
    const logoDims = logoImage.scale(0.025); // Giảm kích thước logo gấp 40 lần

    // Vẽ logo và tiêu đề
    const logoX = 30;
    const textX = 75 + logoDims.width / 2 - 75;

    page.drawImage(logoImage, {
      x: logoX,
      y: height - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });

    page.drawText(`Generated on: ${formattedTimestamp}`, {
      x: textX,
      y: height - 5 - logoDims.height,
      size: 5,
    });

    const title = `Yearly Report for SSPS System - ${year}`;
    const titleWidth = 10 * title.length;
    const titleX = (width - titleWidth) / 2;

    page.drawText(title, {
      x: titleX,
      y: height - 40 - logoDims.height,
      size: 20,
      color: rgb(0, 0.53, 0.71),
    });

    const fullReport = await this.generateFullReportByYear(year);

    let startY = height - 80 - logoDims.height;

    // Vẽ bảng dữ liệu
    for (const campusReport of fullReport) {
      if (startY < 50) {
        page = addNewPage();
        startY = height - 50; // Reset vị trí cho trang mới
      }

      page.drawText(`Campus: ${campusReport.campusName}`, {
        x: 50,
        y: startY,
        size: 14,
        color: rgb(0, 0, 1),
      });
      startY -= 20;

      page.drawText(
        `Total Revenue: ${formatCurrency(campusReport.totalRevenue)}`,
        {
          x: 70,
          y: startY,
          size: 12,
        },
      );
      startY -= 20;

      page.drawText(`Total Customers: ${campusReport.totalCustomers}`, {
        x: 70,
        y: startY,
        size: 12,
      });
      startY -= 20;

      for (const location of campusReport.locations) {
        if (startY < 50) {
          page = addNewPage();
          startY = height - 50;
        }

        page.drawText(`Location: ${location.location}`, {
          x: 90,
          y: startY,
          size: 10,
          color: rgb(0.5, 0.5, 0.5),
        });
        startY -= 20;

        const revenueContributionRate =
          campusReport.totalRevenue > 0
            ? parseFloat(
                (
                  (location.totalRevenue / campusReport.totalRevenue) *
                  100
                ).toFixed(2),
              )
            : 0;

        const usageRate =
          campusReport.totalUsage > 0
            ? parseFloat(
                ((location.totalUsage / campusReport.totalUsage) * 100).toFixed(
                  2,
                ),
              )
            : 0;

        page.drawText(
          `Total Usage: ${location.totalUsage}. Usage Rate: ${usageRate}%`,
          {
            x: 110,
            y: startY,
            size: 10,
          },
        );
        startY -= 20;

        page.drawText(
          `Total Revenue: ${formatCurrency(location.totalRevenue)}. Revenue Contribution Rate: ${revenueContributionRate}%`,
          {
            x: 110,
            y: startY,
            size: 10,
          },
        );
        startY -= 20;

        for (const printer of location.printers) {
          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(`Printer ${printer.printerId}:`, {
            x: 130,
            y: startY,
            size: 10,
          });
          startY -= 20;

          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(
            `Completed ${printer.completedCount}, Failed ${printer.failedCount}`,
            { x: 150, y: startY, size: 10 },
          );
          startY -= 20;

          if (startY < 50) {
            page = addNewPage();
            startY = height - 50;
          }

          page.drawText(
            `Revenue ${printer.revenue} VND, Success Rate: ${printer.successRate}%`,
            { x: 150, y: startY, size: 10 },
          );
          startY -= 20;
        }
      }

      startY -= 20;
    }

    // Xuất file PDF thành buffer
    const pdfBytes = await pdfDoc.save();

    const yearly_report_folder = path.join(
      './src/spso/spso_report/yearly_reports_folder/',
    );

    ensureFolderExists(yearly_report_folder);

    const pdfFilePath = path.join(
      yearly_report_folder,
      `Yearly_Report__${year}.pdf`,
    );

    // Lưu file PDF
    fs.writeFileSync(pdfFilePath, pdfBytes);

    return Buffer.from(pdfBytes);
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

// Đảm bảo thư mục tồn tại
function ensureFolderExists(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // Tạo thư mục, kể cả các thư mục cha
    console.log(`Folder created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
}
