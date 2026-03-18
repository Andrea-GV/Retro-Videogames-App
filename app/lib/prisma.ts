/* *** ACTUALZACIÓN: ***
  Este archivo contiene el nuevo Cliente usando Prisma, el archivo original (db.ts) ya NO SE USA    */
// import "dotenv/config"; // <-- No tengo claro si me hace falta
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // v7^ necesita obligatorio Adapter

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString }); // Necesario para pasarle el argumento al Cliente

// Con esto, evito múltiples instancias en desarrollo (hot reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
