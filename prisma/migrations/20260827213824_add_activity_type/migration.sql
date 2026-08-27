-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('HOTEL', 'SHOPPING', 'FREE_TIME', 'PARK', 'MUSEUM', 'FOOD', 'SIGHTSEEING', 'NIGHTLIFE', 'BEACH', 'NATURE', 'EVENT', 'OTHER');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "type" "ActivityType";
