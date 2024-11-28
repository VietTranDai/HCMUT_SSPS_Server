export const defaultConfigurationData = [
  {
    defaultPage: 10,
    permittedFileTypes: [
      'pdf',
      'doc',
      'png',
      'docx',
      'xlsx',
      'pptx',
      'jpg',
      'txt',
    ], // Định dạng file được phép
    firstTermGivenDate: new Date('2024-09-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
    secondTermGivenDate: new Date('2024-01-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
    thirdTermGivenDate: new Date('2024-06-01T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
    isLastConfiguration: true,
  },
  {
    defaultPage: 15,
    permittedFileTypes: ['txt', 'csv', 'xlsx'],
    firstTermGivenDate: new Date('2024-09-10T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
    secondTermGivenDate: new Date('2024-01-10T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
    thirdTermGivenDate: new Date('2024-06-10T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
    isLastConfiguration: false,
  },
  {
    defaultPage: 30,
    permittedFileTypes: ['docx', 'pptx', 'jpg'],
    firstTermGivenDate: new Date('2024-09-15T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
    secondTermGivenDate: new Date('2024-01-15T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
    thirdTermGivenDate: new Date('2024-06-15T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
    isLastConfiguration: false,
  },
  {
    defaultPage: 25,
    permittedFileTypes: ['pdf', 'docx', 'jpeg', 'png'],
    firstTermGivenDate: new Date('2024-09-20T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
    secondTermGivenDate: new Date('2024-01-20T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
    thirdTermGivenDate: new Date('2024-06-20T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
    isLastConfiguration: false,
  },
  {
    defaultPage: 20,
    permittedFileTypes: ['pdf', 'doc', 'png', 'docx', 'xlsx', 'pptx'], // Định dạng file được phép
    firstTermGivenDate: new Date('2024-09-30T00:00:00.000Z'), // Ngày cấp giấy kỳ 1
    secondTermGivenDate: new Date('2024-01-30T00:00:00.000Z'), // Ngày cấp giấy kỳ 2
    thirdTermGivenDate: new Date('2024-06-30T00:00:00.000Z'), // Ngày cấp giấy kỳ 3
    isLastConfiguration: false, // Đánh dấu là cấu hình mới nhất
  },
];
