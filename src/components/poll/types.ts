import { VoteType } from "@prisma/client";

export interface ParticipantForm {
  name: string;
  votes: Array<VoteType | undefined>;
}

export type PollOption =
  | {
      type: "date";
      date: string;
      index: number;
      score: number;
    }
  | {
      type: "time";
      start: string;
      end: string;
      index: number;
      score: number;
    };

export interface ParticipantInfo {
  id: string;
  name: string;
  votes: Array<VoteType | undefined>;
  editable?: boolean;
  you?: boolean;
}

export interface PollProps {
  options: PollOption[];
  userAlreadyVoted?: boolean;
  participants: ParticipantInfo[];
  onEntry?: (entry: ParticipantForm) => Promise<{ id: string }>;
  onUpdateEntry?: (id: string, entry: ParticipantForm) => Promise<void>;
  onDeleteEntry?: (id: string) => void;
  isBusy?: boolean;
}
