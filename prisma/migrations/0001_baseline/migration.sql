-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "StartupTier" AS ENUM ('FREE', 'PINNED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT,
    "email" TEXT,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Startup" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'DeFi',
    "website" TEXT,
    "twitter" TEXT,
    "founderName" TEXT NOT NULL,
    "founderEmail" TEXT NOT NULL,
    "founderLinkedIn" TEXT,
    "founderTwitter" TEXT,
    "pitchDeckUrl" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "tier" "StartupTier" NOT NULL DEFAULT 'FREE',
    "pinnedAt" TIMESTAMP(3),
    "pinnedUntil" TIMESTAMP(3),
    "pinTxHash" TEXT,
    "pinChain" TEXT,
    "founderId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterFirm" TEXT NOT NULL,
    "requesterRole" TEXT,
    "requesterLinkedIn" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "startupId" TEXT NOT NULL,
    "requesterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "walletFrom" TEXT NOT NULL,
    "walletTo" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Startup_slug_key" ON "Startup"("slug");

-- CreateIndex
CREATE INDEX "Startup_tier_pinnedUntil_idx" ON "Startup"("tier", "pinnedUntil");

-- CreateIndex
CREATE INDEX "Startup_createdAt_idx" ON "Startup"("createdAt");

-- CreateIndex
CREATE INDEX "Startup_approved_createdAt_idx" ON "Startup"("approved", "createdAt");

-- CreateIndex
CREATE INDEX "Startup_slug_idx" ON "Startup"("slug");

-- CreateIndex
CREATE INDEX "Startup_category_approved_idx" ON "Startup"("category", "approved");

-- CreateIndex
CREATE INDEX "AccessRequest_startupId_status_idx" ON "AccessRequest"("startupId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_requesterEmail_startupId_key" ON "AccessRequest"("requesterEmail", "startupId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_txHash_key" ON "Payment"("txHash");

-- CreateIndex
CREATE INDEX "Payment_startupId_idx" ON "Payment"("startupId");

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
