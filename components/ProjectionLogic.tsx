
import { PartyData } from '../types';

export const calculateProjections = (
  parties: PartyData[],
  progress: number,
  totalSeats: number = 500
): PartyData[] => {
  const currentTotalVotes = parties.reduce((acc, p) => acc + p.partyListScore, 0);
  
  // RAW CALCULATION FOR PROJECTION (If progress > 0)
  // Projected Total Votes for each party = current_score / current_progress
  // Predicted Seats = (Projected_Party_Votes / Projected_Total_Votes) * Total_Seats
  
  // Note: Since PartyListScore is what we are using as the primary metric, 
  // we estimate seats proportionally based on their current share.
  
  return parties.map(party => {
    const voteShare = currentTotalVotes > 0 ? party.partyListScore / currentTotalVotes : 0;
    
    // As progress increases, the "Current Seats" approaches "Projected Seats"
    // For simplicity in a single-tier projection, we use the proportional formula
    const projectedSeats = Math.round(voteShare * totalSeats);
    const currentSeats = Math.round(projectedSeats * progress);

    return {
      ...party,
      votePercentage: voteShare * 100,
      projectedSeats: projectedSeats,
      currentSeats: currentSeats
    };
  }).sort((a, b) => b.projectedSeats - a.projectedSeats);
};
