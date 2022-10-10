import { BAD, GOOD, MID } from '@/constants/overview';

export function determineCardStatus(percentage: number) {
  if (percentage < 33) {
    return BAD;
  } else if (percentage > 66) {
    return GOOD;
  }

  return MID;
}
