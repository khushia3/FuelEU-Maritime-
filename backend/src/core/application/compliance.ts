// Core business logic for computing compliance balance

export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ
export const ENERGY_FACTOR = 41000; // MJ/t

export function computeComplianceBalance(
  fuelConsumption: number,
  actualGhgIntensity: number,
): number {
  const energyInScope = fuelConsumption * ENERGY_FACTOR;
  return (TARGET_INTENSITY_2025 - actualGhgIntensity) * energyInScope;
}

export function validatePoolAllocation(
  members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>,
): { valid: boolean; reason?: string } {
  // 1. Sum of CB before and after should be the same (conservation)
  const sumBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
  const sumAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);
  
  if (Math.abs(sumBefore - sumAfter) > 0.01) {
    return { valid: false, reason: 'CB sum not conserved' };
  }

  // 2. No deficit ship should exit worse than entry
  const hasWorseDeficit = members.some(
    m => m.cbBefore < 0 && m.cbAfter < m.cbBefore
  );
  
  if (hasWorseDeficit) {
    return { valid: false, reason: 'Deficit ships cannot exit worse' };
  }

  // 3. No surplus ship should go negative
  const hasSurplusGoneNegative = members.some(
    m => m.cbBefore > 0 && m.cbAfter < 0
  );
  
  if (hasSurplusGoneNegative) {
    return { valid: false, reason: 'Surplus ships cannot exit negative' };
  }

  return { valid: true };
}

export function allocatePoolBalances(
  members: Array<{ shipId: string; cbBefore: number }>
): Array<{ shipId: string; cbBefore: number; cbAfter: number }> {
  // Sort members by CB descending (surpluses first)
  const sortedMembers = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
  
  // Find total surplus and deficit
  const surplusMembers = sortedMembers.filter(m => m.cbBefore > 0);
  const deficitMembers = sortedMembers.filter(m => m.cbBefore < 0);
  
  const totalSurplus = surplusMembers.reduce((sum, m) => sum + m.cbBefore, 0);
  const totalDeficit = Math.abs(deficitMembers.reduce((sum, m) => sum + m.cbBefore, 0));
  
  // If not enough surplus to cover deficit, allocate proportionally
  const allocationFactor = totalSurplus >= totalDeficit ? 1 : totalSurplus / totalDeficit;
  
  // Allocate surpluses to deficits
  return sortedMembers.map(member => {
    if (member.cbBefore >= 0) {
      // Surplus ships keep remaining surplus
      const contribution = member.cbBefore * (totalDeficit / totalSurplus);
      return {
        ...member,
        cbAfter: member.cbBefore - (contribution * allocationFactor)
      };
    } else {
      // Deficit ships get proportional allocation
      return {
        ...member,
        cbAfter: member.cbBefore + Math.abs(member.cbBefore) * allocationFactor
      };
    }
  });
}