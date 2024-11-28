/*
  Warnings:

  - You are about to alter the column `currentPage` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `currentPage` DOUBLE NOT NULL DEFAULT 0;
