/*
  Warnings:

  - You are about to drop the column `totalPage` on the `document` table. All the data in the column will be lost.
  - The values [A1,A2,A5] on the enum `Document_pageSize` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalPage` on the `printservicelog` table. All the data in the column will be lost.
  - Added the required column `totalCostPage` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPageCost` to the `PrintServiceLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_PrintLogId_fkey`;

-- AlterTable
ALTER TABLE `customer` MODIFY `currentPage` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `document` DROP COLUMN `totalPage`,
    ADD COLUMN `totalCostPage` INTEGER NOT NULL,
    MODIFY `PrintLogId` VARCHAR(191) NULL,
    MODIFY `pageSize` ENUM('A3', 'A4') NOT NULL;

-- AlterTable
ALTER TABLE `printservicelog` DROP COLUMN `totalPage`,
    ADD COLUMN `totalPageCost` JSON NOT NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_PrintLogId_fkey` FOREIGN KEY (`PrintLogId`) REFERENCES `PrintServiceLog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
