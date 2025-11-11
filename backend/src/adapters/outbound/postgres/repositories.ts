import { PrismaClient } from '@prisma/client';
import { IRouteRepository, IComplianceRepository, IBankingRepository, IPoolRepository } from '../../../core/ports/repositories';
import { Route, ComplianceBalance, BankEntry, Pool, PoolMember } from '../../../core/domain/types';

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Route[]> {
    return this.prisma.route.findMany();
  }

  async findById(id: string): Promise<Route | null> {
    return this.prisma.route.findUnique({
      where: { id }
    });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return this.prisma.route.findUnique({
      where: { routeId }
    });
  }

  async setBaseline(id: string): Promise<Route> {
    await this.clearOtherBaselines();
    return this.prisma.route.update({
      where: { id },
      data: { isBaseline: true }
    });
  }

  async clearOtherBaselines(): Promise<void> {
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });
  }
}

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async getBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const record = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }
      }
    });
    return record ? {
      shipId: record.shipId,
      year: record.year,
      cbGco2eq: record.cbGco2eq
    } : null;
  }

  async saveBalance(balance: ComplianceBalance): Promise<ComplianceBalance> {
    const record = await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: balance.shipId,
          year: balance.year
        }
      },
      update: {
        cbGco2eq: balance.cbGco2eq ?? 0
      },
      create: {
        shipId: balance.shipId,
        year: balance.year,
        cbGco2eq: balance.cbGco2eq ?? 0
      }
    });
    return {
      shipId: record.shipId,
      year: record.year,
      cbGco2eq: record.cbGco2eq
    };
  }
}

export class PostgresBankingRepository implements IBankingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year }
    });
    return entries.map(entry => ({
      id: entry.id,
      shipId: entry.shipId,
      year: entry.year,
      amountGco2eq: entry.amountGco2eq
    }));
  }

  async createEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry> {
    const record = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId!,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq
      }
    });
    return {
      id: record.id,
      shipId: record.shipId,
      year: record.year,
      amountGco2eq: record.amountGco2eq
    };
  }
}

export class PostgresPoolRepository implements IPoolRepository {
  constructor(private prisma: PrismaClient) {}

  async create(year: number, members: PoolMember[]): Promise<Pool> {
    return this.prisma.$transaction(async (tx) => {
      const pool = await tx.pool.create({
        data: {
          year,
          members: {
            create: members.map(m => ({
              shipId: m.shipId!,
              cbBefore: m.cbBefore!,
              cbAfter: m.cbAfter!
            }))
          }
        },
        include: {
          members: true
        }
      });

      return {
        id: pool.id,
        year: pool.year,
        members: pool.members.map((m: any) => ({
          shipId: m.shipId,
          cbBefore: m.cbBefore,
          cbAfter: m.cbAfter
        }))
      };
    });
  }

  async findById(id: string): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: {
        members: true
      }
    });

    if (!pool) return null;

    return {
      id: pool.id,
      year: pool.year,
      members: pool.members.map(m => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter
      }))
    };
  }

  async addMember(poolId: string, member: PoolMember): Promise<PoolMember> {
    const record = await this.prisma.poolMember.create({
      data: {
        poolId,
        shipId: member.shipId!,
        cbBefore: member.cbBefore!,
        cbAfter: member.cbAfter!
      }
    });
    return {
      shipId: record.shipId,
      cbBefore: record.cbBefore,
      cbAfter: record.cbAfter
    };
  }
}