import clsx from "clsx";
import { groupBy } from "lodash";
import * as React from "react";

import { PollOption } from "../types";
import PollOptions from "./poll-options";

export interface GroupedOptionsProps {
  options: PollOption[];
  editable?: boolean;
  selectedParticipantId?: string;
  group: (option: PollOption) => string;
  groupClassName?: string;
}

const GroupedOptions: React.VoidFunctionComponent<GroupedOptionsProps> = ({
  options,
  editable,
  selectedParticipantId,
  group,
  groupClassName,
}) => {
  const grouped = groupBy(options, group);

  return (
    <div className="select-none divide-y bg-white">
      {Object.entries(grouped).map(([day, options]) => {
        return (
          <div key={day}>
            <div
              className={clsx(
                "sticky top-[109px] z-10 flex border-b bg-gray-50/80 py-2 px-4 text-sm font-semibold shadow-sm backdrop-blur-md",
                groupClassName,
              )}
            >
              {day}
            </div>
            <PollOptions
              options={options}
              editable={editable}
              selectedParticipantId={selectedParticipantId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GroupedOptions;
