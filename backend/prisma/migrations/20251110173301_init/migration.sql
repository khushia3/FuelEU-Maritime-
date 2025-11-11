-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghg_intensity" REAL NOT NULL,
    "is_baseline" BOOLEAN NOT NULL DEFAULT false,
    "vessel_type" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "fuel_consumption" REAL NOT NULL,
    "distance" REAL NOT NULL,
    "total_emissions" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ship_compliance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ship_compliance_ship_id_fkey" FOREIGN KEY ("ship_id") REFERENCES "routes" ("route_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bank_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount_gco2eq" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bank_entries_ship_id_fkey" FOREIGN KEY ("ship_id") REFERENCES "routes" ("route_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "pool_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pool_id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "cb_before" REAL NOT NULL,
    "cb_after" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pool_members_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pool_members_ship_id_fkey" FOREIGN KEY ("ship_id") REFERENCES "routes" ("route_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "routes_route_id_key" ON "routes"("route_id");

-- CreateIndex
CREATE UNIQUE INDEX "ship_compliance_ship_id_year_key" ON "ship_compliance"("ship_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "pool_members_pool_id_ship_id_key" ON "pool_members"("pool_id", "ship_id");
