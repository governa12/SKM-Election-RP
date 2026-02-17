
export interface PartyData {
  name: string;
  partyListScore: number;
  candidateName: string;
  color: string;
  logo: string;
  coalitionGroup?: 'GOV' | 'OPP' | 'NON';
  // Calculated fields
  projectedSeats: number;
  currentSeats: number;
  votePercentage: number;
}

export interface ElectionDataResponse {
  parties: PartyData[];
  noneVotes: number;
}

export interface ElectionSummary {
  totalVotes: number;
  reportingProgress: number; // 0 to 1 (e.g., 0.6 for 60%)
  totalSeats: number;
}

export interface NewsUpdate {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  type?: 'news' | 'milestone' | 'alert';
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  description: string;
  isImportant?: boolean;
}
