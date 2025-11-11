import { computeComplianceBalance, validatePoolAllocation, allocatePoolBalances } from '../src/core/application/compliance';

describe('Compliance Balance Calculations', () => {
  it('should compute compliance balance correctly', () => {
    // Test case: 1000t fuel with 100 gCO₂e/MJ intensity
    const balance = computeComplianceBalance(1000, 100);
    // Expected: (89.3368 - 100) * 1000 * 41000 = -436981200
    expect(Math.round(balance)).toBe(-436981200);
  });

  it('should validate pool allocations', () => {
    const validPool = [
      { shipId: 'ship1', cbBefore: 1000000, cbAfter: 500000 },
      { shipId: 'ship2', cbBefore: -800000, cbAfter: -300000 }
    ];
    
    const result = validatePoolAllocation(validPool);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid pool allocations', () => {
    const invalidPool = [
      { shipId: 'ship1', cbBefore: 1000000, cbAfter: -100000 }, // surplus goes negative
      { shipId: 'ship2', cbBefore: -800000, cbAfter: -900000 }  // deficit gets worse
    ];
    
    const result = validatePoolAllocation(invalidPool);
    expect(result.valid).toBe(false);
  });

  it('should allocate pool balances correctly', () => {
    const members = [
      { shipId: 'ship1', cbBefore: 1000000 },
      { shipId: 'ship2', cbBefore: -800000 }
    ];
    
    const allocation = allocatePoolBalances(members);
    
    expect(allocation).toHaveLength(2);
    expect(allocation[0].cbAfter).toBeGreaterThan(0);  // surplus ship keeps some surplus
    expect(allocation[1].cbAfter).toBeGreaterThan(-800000);  // deficit ship improves
  });
});