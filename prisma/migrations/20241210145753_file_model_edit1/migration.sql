/*
  Warnings:

  - You are about to drop the column `filesize` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `filetype` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `File` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "filesize",
DROP COLUMN "filetype",
DROP COLUMN "key",
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
