/*
  Warnings:

  - Added the required column `location` to the `LoginAudit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginAudit" ADD COLUMN     "location" TEXT NOT NULL;
