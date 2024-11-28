/*
  Warnings:

  - You are about to drop the column `defaultGivenDate` on the `defaultconfiguration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `defaultconfiguration` DROP COLUMN `defaultGivenDate`,
    ADD COLUMN `firstTermGivenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `secondTermGivenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `thirdTermGivenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
