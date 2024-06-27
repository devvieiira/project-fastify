/*
  Warnings:

  - Added the required column `file` to the `Transcription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `Transcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transcription" ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "result" TEXT NOT NULL;
