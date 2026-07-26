-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "commissionAmount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "vendorAmount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "deliveryFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "payouts" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "price" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "compareAtPrice" SET DATA TYPE DECIMAL(18,2);

-- CreateIndex
CREATE INDEX "order_items_vendorId_createdAt_idx" ON "order_items"("vendorId", "createdAt");

-- CreateIndex
CREATE INDEX "products_tags_idx" ON "products" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");
