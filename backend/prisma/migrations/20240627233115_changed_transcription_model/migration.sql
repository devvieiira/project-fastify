/*
  Warnings:

  - Added the required column `createdAt` to the `Transcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "transcriptionId" TEXT;

-- AlterTable
ALTER TABLE "Transcription" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "Transcription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
