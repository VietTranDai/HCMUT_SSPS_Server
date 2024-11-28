import { PurchaseStatus } from '@prisma/client';

export const purchaseLogData = [
  {
    customerId: '2213951',
    orderId: 'ORD001',
    transactionTime: new Date('2024-11-01T10:00:00.000Z'),
    numberOfPage: 50,
    price: 100.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2213951',
    orderId: 'ORD011',
    transactionTime: new Date('2024-11-12T13:30:00.000Z'),
    numberOfPage: 75,
    price: 150.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2213951',
    orderId: 'ORD012',
    transactionTime: new Date('2024-11-14T16:00:00.000Z'),
    numberOfPage: 30,
    price: 60.0,
    purchaseStatus: PurchaseStatus.FAILED,
  },
  {
    customerId: '2213866',
    orderId: 'ORD002',
    transactionTime: new Date('2024-11-02T11:15:00.000Z'),
    numberOfPage: 30,
    price: 60.0,
    purchaseStatus: PurchaseStatus.PENDING,
  },
  {
    customerId: '2213866',
    orderId: 'ORD013',
    transactionTime: new Date('2024-11-16T09:00:00.000Z'),
    numberOfPage: 40,
    price: 80.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211288',
    orderId: 'ORD003',
    transactionTime: new Date('2024-11-03T14:30:00.000Z'),
    numberOfPage: 20,
    price: 40.0,
    purchaseStatus: PurchaseStatus.FAILED,
  },
  {
    customerId: '2211288',
    orderId: 'ORD009',
    transactionTime: new Date('2024-11-09T18:45:00.000Z'),
    numberOfPage: 100,
    price: 200.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211288',
    orderId: 'ORD014',
    transactionTime: new Date('2024-11-17T12:30:00.000Z'),
    numberOfPage: 90,
    price: 180.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211599',
    orderId: 'ORD004',
    transactionTime: new Date('2024-11-04T16:45:00.000Z'),
    numberOfPage: 70,
    price: 140.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211599',
    orderId: 'ORD010',
    transactionTime: new Date('2024-11-10T20:15:00.000Z'),
    numberOfPage: 50,
    price: 100.0,
    purchaseStatus: PurchaseStatus.PENDING,
  },
  {
    customerId: '2211599',
    orderId: 'ORD015',
    transactionTime: new Date('2024-11-18T14:20:00.000Z'),
    numberOfPage: 120,
    price: 240.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211738',
    orderId: 'ORD005',
    transactionTime: new Date('2024-11-05T09:15:00.000Z'),
    numberOfPage: 40,
    price: 80.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
  {
    customerId: '2211738',
    orderId: 'ORD016',
    transactionTime: new Date('2024-11-19T15:00:00.000Z'),
    numberOfPage: 60,
    price: 120.0,
    purchaseStatus: PurchaseStatus.PENDING,
  },
  {
    customerId: '2111682',
    orderId: 'ORD006',
    transactionTime: new Date('2024-11-06T11:00:00.000Z'),
    numberOfPage: 60,
    price: 120.0,
    purchaseStatus: PurchaseStatus.PENDING,
  },
  {
    customerId: '2111682',
    orderId: 'ORD017',
    transactionTime: new Date('2024-11-20T10:30:00.000Z'),
    numberOfPage: 70,
    price: 140.0,
    purchaseStatus: PurchaseStatus.FAILED,
  },
  {
    customerId: '2111682',
    orderId: 'ORD018',
    transactionTime: new Date('2024-11-21T08:15:00.000Z'),
    numberOfPage: 100,
    price: 200.0,
    purchaseStatus: PurchaseStatus.COMPLETED,
  },
];
