import { Option, User } from "@prisma/client";

export type GetPollApiResponse = {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  options: Option[];
  user: User | null;
  timeZone: string | null;
  adminUrlId: string;
  participantUrlId: string;
  closed: boolean;
  admin: boolean;
  legacy: boolean;
  demo: boolean;
  deleted: boolean;
  notifications: boolean;
  createdAt: Date;
};

export type OptionType = "date" | "time";

interface OptionBase {
  type: OptionType;
}

export interface DateOption extends OptionBase {
  type: "date";
  date: string;
}

export interface TimeOption extends OptionBase {
  type: "time";
  start: string;
  end: string;
}

export type PollOption<T extends OptionType = OptionType> = {
  id: string;
  value: (DateOption | TimeOption) & { type: T };
};
