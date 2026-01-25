/*
  Warnings:

  - A unique constraint covering the columns `[userId,platform,accountName]` on the table `PlatformAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlatformAccount_userId_platform_accountName_key" ON "PlatformAccount"("userId", "platform", "accountName");
