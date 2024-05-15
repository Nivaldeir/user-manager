/*
  Warnings:

  - You are about to drop the column `details` on the `LoginAudit` table. All the data in the column will be lost.
  - You are about to drop the column `id_address` on the `LoginAudit` table. All the data in the column will be lost.
  - You are about to drop the column `user_email` on the `LoginAudit` table. All the data in the column will be lost.
  - You are about to drop the `PasswordResetRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `device` to the `LoginAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `LoginAudit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PasswordResetRequest" DROP CONSTRAINT "PasswordResetRequest_user_authentication_id_fkey";

-- AlterTable
ALTER TABLE "LoginAudit" DROP COLUMN "details",
DROP COLUMN "id_address",
DROP COLUMN "user_email",
ADD COLUMN     "device" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "ip" TEXT NOT NULL DEFAULT '0.0.0.0';

-- DropTable
DROP TABLE "PasswordResetRequest";
