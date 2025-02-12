/*
  Warnings:

  - You are about to drop the column `online` on the `Client` table. All the data in the column will be lost.
  - Added the required column `hostname` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "online",
ADD COLUMN     "hostname" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClientKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ClientKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientKey_key_key" ON "ClientKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ClientKey_userId_key" ON "ClientKey"("userId");

-- AddForeignKey
ALTER TABLE "ClientKey" ADD CONSTRAINT "ClientKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
