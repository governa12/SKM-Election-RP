
import { PartyData, ElectionDataResponse } from '../types';

const ELECTION_SHEET_ID = '1NH4PTbacZbHGCAoVehyrJeKlCD5VyUv8vCRK80bYcq4';
const ADMIN_SHEET_ID = '1VHEwHdgFrNUx_Post8oQlig6pVDwhEfH1V0kY8ltiLM';

const ELECTION_CSV_URL = `https://docs.google.com/spreadsheets/d/${ELECTION_SHEET_ID}/export?format=csv&gid=0`;
const ADMIN_CSV_URL = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/export?format=csv&gid=0`;

// Fallback data in case of fetch failure
const MOCK_PARTIES: PartyData[] = [
  { name: 'พรรคก้าวไกล', candidateName: 'พิธา ลิ้มเจริญรัตน์', partyListScore: 14000000, color: '#f97316', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Move_Forward_Party_Logo.svg/1200px-Move_Forward_Party_Logo.svg.png', projectedSeats: 151, currentSeats: 151, votePercentage: 38, coalitionGroup: 'OPP' },
  { name: 'พรรคเพื่อไทย', candidateName: 'แพทองธาร ชินวัตร', partyListScore: 10000000, color: '#dc2626', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pheu_Thai_Party_Logo.png', projectedSeats: 141, currentSeats: 141, votePercentage: 27, coalitionGroup: 'GOV' },
  { name: 'พรรคภูมิใจไทย', candidateName: 'อนุทิน ชาญวีรกูล', partyListScore: 5000000, color: '#1d4ed8', logo: 'https://upload.wikimedia.org/wikipedia/th/1/1b/Bhumjaithai_Party_Logo.png', projectedSeats: 71, currentSeats: 71, votePercentage: 13, coalitionGroup: 'GOV' },
  { name: 'พรรคพลังประชารัฐ', candidateName: 'พล.อ.ประวิตร วงษ์สุวรรณ', partyListScore: 2000000, color: '#1e40af', logo: 'https://upload.wikimedia.org/wikipedia/th/thumb/a/a9/Palang_Pracharath_Party_Logo.png/640px-Palang_Pracharath_Party_Logo.png', projectedSeats: 40, currentSeats: 40, votePercentage: 5, coalitionGroup: 'GOV' },
];

/**
 * Robust CSV parser that handles quoted strings containing commas
 */
function parseCSVRow(row: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchElectionData(): Promise<ElectionDataResponse> {
  try {
    const response = await fetch(ELECTION_CSV_URL);
    if (!response.ok) throw new Error('Fetch failed - Response not OK');
    
    const text = await response.text();
    if (!text || text.includes('<!DOCTYPE html>')) throw new Error('Invalid CSV format - Possibly HTML login page');

    const rows = text.split(/\r?\n/).filter(line => line.trim().length > 0).slice(1); 

    let noneVotes = 0;
    const parties: PartyData[] = [];

    rows.forEach(row => {
      const columns = parseCSVRow(row);
      if (columns.length < 2) return;

      const name = columns[0].replace(/^"|"$/g, '').trim();
      const scoreStr = columns[1].replace(/^"|"$/g, '').replace(/,/g, '');
      const score = parseInt(scoreStr) || 0;

      if (name === 'ไม่ประสงค์ลงคะเเนน') {
        noneVotes = score;
      } else if (columns.length >= 5) {
        const candidate = columns[2].replace(/^"|"$/g, '');
        const colorCode = columns[3].replace(/^"|"$/g, '');
        const logo = columns[4].replace(/^"|"$/g, '');
        // Column F (index 5) is Coalition Group
        const coalitionStatus = columns[5]?.replace(/^"|"$/g, '').toUpperCase() || 'NON';
        const group = (coalitionStatus === 'GOV' || coalitionStatus === 'OPP') ? coalitionStatus : 'NON';

        parties.push({
          name,
          partyListScore: score,
          candidateName: candidate,
          color: colorCode.startsWith('#') ? colorCode : `#${colorCode}`,
          logo: logo,
          coalitionGroup: group as 'GOV' | 'OPP' | 'NON',
          projectedSeats: 0,
          currentSeats: 0,
          votePercentage: 0,
        });
      }
    });

    if (parties.length === 0) throw new Error('No parties parsed');
    return { parties, noneVotes };
  } catch (error) {
    console.warn('Network fetch failed, using fallback data:', error);
    return { parties: MOCK_PARTIES, noneVotes: 500000 };
  }
}

export async function fetchAdminCredentials(): Promise<Record<string, string>> {
  try {
    const response = await fetch(ADMIN_CSV_URL);
    if (!response.ok) return { "admin": "2026" };
    
    const text = await response.text();
    const rows = text.split(/\r?\n/).filter(line => line.trim().length > 0).slice(1); 

    const credentials: Record<string, string> = {};
    rows.forEach(row => {
      const columns = parseCSVRow(row);
      if (columns.length >= 2) {
        const username = columns[0].replace(/^"|"$/g, '').trim();
        const password = columns[1].replace(/^"|"$/g, '').trim();
        if (username && password) {
          credentials[username] = password;
        }
      }
    });
    return Object.keys(credentials).length > 0 ? credentials : { "admin": "2026" };
  } catch (error) {
    return { "admin": "2026" };
  }
}
