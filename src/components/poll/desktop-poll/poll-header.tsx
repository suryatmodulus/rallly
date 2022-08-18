import clsx from "clsx";
import * as React from "react";

import { useDayjs } from "../../../utils/dayjs";
import { ScoreSummary } from "../score-summary";
import { PollOption } from "../types";
import ControlledScrollArea from "./controlled-scroll-area";
import { usePollContext } from "./poll-context";

const TimeRange: React.VoidFunctionComponent<{
  startTime: string;
  endTime: string;
  className?: string;
}> = ({ startTime, endTime, className }) => {
  const { dayjs } = useDayjs();
  return (
    <div
      className={clsx(
        "relative -mr-2 inline-block pr-2 text-right text-xs font-semibold after:absolute after:top-2 after:right-0 after:h-4 after:w-1 after:border-t after:border-r after:border-b after:border-slate-300 after:content-['']",
        className,
      )}
    >
      <div>{dayjs(startTime).format("LT")}</div>
      <div className="text-slate-400">{dayjs(endTime).format("LT")}</div>
    </div>
  );
};

const PollHeader: React.VoidFunctionComponent<{
  options: Array<PollOption>;
}> = ({ options }) => {
  const { columnWidth } = usePollContext();
  const {dayjs} = useDayjs();
  return (
    <ControlledScrollArea>
      {options.map((option, i) => {
        const date = dayjs(option.type === "date" ? option.date : option.start);

        return (
          <div
            key={i}
            className="shrink-0 space-y-3 py-2 text-center"
            style={{ width: columnWidth }}
          >
            <div>
              <div className="leading-9">
                <div className="text-xs font-semibold uppercase text-slate-500/75">
                  {date.format("ddd")}
                </div>
                <div className="text-2xl font-semibold">{date.format("D")}</div>
                <div className="text-xs font-medium uppercase text-slate-500/50">
                  {date.format("MMM")}
                </div>
              </div>
            </div>
            {option.type === "time" ? (
              <TimeRange
                className="mt-3"
                startTime={option.start}
                endTime={option.end}
              />
            ) : null}
            <div className="flex justify-center">
              <ScoreSummary yesScore={option.score} />
            </div>
          </div>
        );
      })}
    </ControlledScrollArea>
  );
};

export default PollHeader;
