import { PrinterStatus } from '@prisma/client';

export const printersData = [
  {
    id: 'printer-001',
    brandName: 'HP',
    model: 'LaserJet Pro M404dn',
    shortDescription: 'Black and white laser printer, double-sided',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'A1-101', // ID của vị trí máy in đã khai báo trong printerLocationsData
  },
  {
    id: 'printer-002',
    brandName: 'Canon',
    model: 'ImageCLASS LBP6230dw',
    shortDescription: 'Compact, double-sided monochrome laser printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'A1-102',
  },
  {
    id: 'printer-003',
    brandName: 'Epson',
    model: 'EcoTank ET-4760',
    shortDescription: 'All-in-one color inkjet printer, wireless',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'A3-301',
  },
  {
    id: 'printer-004',
    brandName: 'Brother',
    model: 'HL-L2370DW',
    shortDescription: 'Monochrome laser printer, high-speed printing',
    printerStatus: PrinterStatus.MAINTENANCE,
    isInProgress: true,
    locationId: 'A4-401',
  },
  {
    id: 'printer-005',
    brandName: 'HP',
    model: 'OfficeJet Pro 9025e',
    shortDescription: 'Color inkjet printer, multi-function',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: true,
    locationId: 'A5-102',
  },
  {
    id: 'printer-006',
    brandName: 'Canon',
    model: 'PIXMA TR8620a',
    shortDescription: 'All-in-one color inkjet printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B1-102',
  },
  {
    id: 'printer-007',
    brandName: 'Epson',
    model: 'WorkForce Pro WF-4740',
    shortDescription: 'High-speed color inkjet printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B2-203',
  },
  {
    id: 'printer-008',
    brandName: 'Brother',
    model: 'HL-L8360CDW',
    shortDescription: 'Color laser printer, double-sided',
    printerStatus: PrinterStatus.MAINTENANCE,
    isInProgress: true,
    locationId: 'B3-103',
  },
  {
    id: 'printer-009',
    brandName: 'HP',
    model: 'LaserJet Pro MFP M428fdw',
    shortDescription: 'Monochrome multi-function laser printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B4-204',
  },
  {
    id: 'printer-010',
    brandName: 'Canon',
    model: 'imageRUNNER 1643iF',
    shortDescription: 'High-speed monochrome laser printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B6-105',
  },
  {
    id: 'printer-011',
    brandName: 'Epson',
    model: 'EcoTank ET-2760',
    shortDescription: 'Color inkjet printer, high-capacity tank',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B8-207',
  },
  {
    id: 'printer-012',
    brandName: 'Brother',
    model: 'MFC-L2750DW',
    shortDescription: 'Monochrome laser printer, multi-function',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: true,
    locationId: 'B9-101',
  },
  {
    id: 'printer-013',
    brandName: 'HP',
    model: 'LaserJet Enterprise M507dn',
    shortDescription: 'High-speed monochrome laser printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'B10-110',
  },
  {
    id: 'printer-014',
    brandName: 'Canon',
    model: 'imageCLASS MF743Cdw',
    shortDescription: 'Color laser printer, double-sided',
    printerStatus: PrinterStatus.MAINTENANCE,
    isInProgress: false,
    locationId: 'B11-302',
  },
  {
    id: 'printer-015',
    brandName: 'Brother',
    model: 'HL-L5200DWT',
    shortDescription: 'Monochrome laser printer, dual paper trays',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'C1-203',
  },
  {
    id: 'printer-016',
    brandName: 'HP',
    model: 'Color LaserJet Pro M479fdw',
    shortDescription: 'Color laser printer, multi-function',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'C5-101',
  },
  {
    id: 'printer-017',
    brandName: 'Epson',
    model: 'WorkForce Pro WF-7820',
    shortDescription: 'High-speed wide-format color inkjet printer',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: true,
    locationId: 'C6-210',
  },
  {
    id: 'printer-018',
    brandName: 'Canon',
    model: 'PIXMA G7020',
    shortDescription: 'Color inkjet printer, high-yield tank',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'H1-101',
  },
  {
    id: 'printer-019',
    brandName: 'HP',
    model: 'LaserJet Pro M118dw',
    shortDescription: 'Monochrome laser printer, wireless',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'H2-202',
  },
  {
    id: 'printer-020',
    brandName: 'Brother',
    model: 'MFC-J995DW',
    shortDescription: 'Color inkjet printer, multi-function',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'H3-303',
  },
  {
    id: 'printer-021',
    brandName: 'Epson',
    model: 'WorkForce Pro WF-3720',
    shortDescription: 'Color inkjet printer, high-efficiency',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'H6-101',
  },
  {
    id: 'printer-022',
    brandName: 'Canon',
    model: 'imageCLASS LBP226dw',
    shortDescription: 'Monochrome laser printer, high-speed printing',
    printerStatus: PrinterStatus.ENABLE,
    isInProgress: false,
    locationId: 'NVĐ-01',
  },
];