/*
  Warnings:

  - You are about to drop the column `PrintLogId` on the `document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_PrintLogId_fkey`;

-- AlterTable
ALTER TABLE `document` DROP COLUMN `PrintLogId`,
    ADD COLUMN `printLogId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_printLogId_fkey` FOREIGN KEY (`printLogId`) REFERENCES `PrintServiceLog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
