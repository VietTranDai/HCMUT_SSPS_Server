/*
  Warnings:

  - You are about to alter the column `fileContent` on the `document` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `reportContent` on the `periodicreport` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `document` MODIFY `fileContent` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `periodicreport` MODIFY `reportContent` VARCHAR(191) NOT NULL;
