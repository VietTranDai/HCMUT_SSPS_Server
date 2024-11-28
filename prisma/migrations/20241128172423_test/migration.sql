/*
  Warnings:

  - Changed the type of `totalPageCost` on the `printservicelog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `printservicelog` DROP COLUMN `totalPageCost`,
    ADD COLUMN `totalPageCost` INTEGER NOT NULL;
