-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "versionId" TEXT;

-- CreateIndex
CREATE INDEX "comments_versionId_idx" ON "comments"("versionId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "track_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
