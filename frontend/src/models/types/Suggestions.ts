// types/suggestions.ts or types/member.ts

import { IMember } from "./Member";

export interface ISuggestions {
  member: IMember;
  currentLoad: number;
  remainingCapacity: number;
}
