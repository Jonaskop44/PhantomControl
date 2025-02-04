-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hwid" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
