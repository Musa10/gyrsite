import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In dev, Postgres runs in WSL2/Docker and the app reaches it over `localhost`,
// whose port-forwarding proxy silently drops *idle* TCP connections while
// Postgres keeps its side open. With keepalive off (pg's default), the pool hands
// out those dead sockets → intermittent `P1017 ConnectionClosed`. keepAlive makes
// the OS probe idle sockets (so the proxy won't reap them, and half-open sockets
// are detected), and a short idleTimeoutMillis recycles connections before the
// proxy can kill them.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  idleTimeoutMillis: 10_000,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
