import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import * as React from "react";
import { useMeasure } from "react-use";
import smoothscroll from "smoothscroll-polyfill";

import Check from "@/components/icons/check.svg";
import Plus from "@/components/icons/plus-sm.svg";

import { Button } from "../button";
import ArrowLeft from "../icons/arrow-left.svg";
import ArrowRight from "../icons/arrow-right.svg";
import { usePoll } from "../poll-context";
import ParticipantRow from "./desktop-poll/participant-row";
import ParticipantRowForm from "./desktop-poll/participant-row-form";
import { PollContext } from "./desktop-poll/poll-context";
import PollHeader from "./desktop-poll/poll-header";
import { PollProps } from "./types";

// TODO (Luke Vella) [2022-07-15]: Not sure if the smoothscroll polyfill is still needed.
if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

const MotionButton = motion(Button);

const minSidebarWidth = 200;

const TableViewPoll: React.VoidFunctionComponent<
  PollProps & { width: number }
> = ({
  options,
  participants,
  onEntry,
  onDeleteEntry,
  onUpdateEntry,
  isBusy,
  width,
}) => {
  const { t } = useTranslation("app");

  const { poll, userAlreadyVoted } = usePoll();

  const [editingParticipantId, setEditingParticipantId] =
    React.useState<string | null>(null);

  const actionColumnWidth = 140;
  const columnWidth = Math.min(
    130,
    Math.max(
      90,
      (width - minSidebarWidth - actionColumnWidth) / options.length,
    ),
  );

  const numberOfVisibleColumns = Math.min(
    options.length,
    Math.floor((width - (minSidebarWidth + actionColumnWidth)) / columnWidth),
  );

  const sidebarWidth = Math.min(
    width - (numberOfVisibleColumns * columnWidth + actionColumnWidth),
    250,
  );

  const availableSpace = Math.min(
    numberOfVisibleColumns * columnWidth,
    options.length * columnWidth,
  );

  const [activeOptionId, setActiveOptionId] =
    React.useState<string | null>(null);

  const [scrollPosition, setScrollPosition] = React.useState(0);

  const maxScrollPosition =
    columnWidth * options.length - columnWidth * numberOfVisibleColumns;

  const [shouldShowNewParticipantForm, setShouldShowNewParticipantForm] =
    React.useState(!userAlreadyVoted);

  const pollWidth =
    sidebarWidth + options.length * columnWidth + actionColumnWidth;

  const goToNextPage = () => {
    setScrollPosition(
      Math.min(
        maxScrollPosition,
        scrollPosition + numberOfVisibleColumns * columnWidth,
      ),
    );
  };

  const goToPreviousPage = () => {
    setScrollPosition(
      Math.max(0, scrollPosition - numberOfVisibleColumns * columnWidth),
    );
  };

  const participantListContainerRef = React.useRef<HTMLDivElement>(null);
  return (
    <PollContext.Provider
      value={{
        activeOptionId,
        setActiveOptionId,
        scrollPosition,
        setScrollPosition,
        columnWidth,
        sidebarWidth,
        goToNextPage,
        goToPreviousPage,
        numberOfColumns: numberOfVisibleColumns,
        availableSpace,
        actionColumnWidth,
        maxScrollPosition,
      }}
    >
      <div className="flex flex-col overflow-hidden">
        <div>
          <div className="flex py-2">
            <div
              className="flex shrink-0 items-center py-2 pl-4 pr-2 font-medium"
              style={{ width: sidebarWidth }}
            >
              <div className="flex h-full grow items-end">
                {t("participantCount", { count: participants.length })}
              </div>
              <AnimatePresence initial={false}>
                {scrollPosition > 0 ? (
                  <MotionButton
                    transition={{ duration: 0.1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    rounded={true}
                    onClick={goToPreviousPage}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </MotionButton>
                ) : null}
              </AnimatePresence>
            </div>
            <PollHeader options={options} />
            <div
              className="flex items-center py-3 px-2"
              style={{ width: actionColumnWidth }}
            >
              {maxScrollPosition > 0 ? (
                <AnimatePresence initial={false}>
                  {scrollPosition < maxScrollPosition ? (
                    <MotionButton
                      transition={{ duration: 0.1 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-xs"
                      rounded={true}
                      onClick={() => {
                        goToNextPage();
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </MotionButton>
                  ) : null}
                </AnimatePresence>
              ) : null}
            </div>
          </div>
        </div>
        {participants.length > 0 ? (
          <div
            className="min-h-0 overflow-y-auto py-1"
            ref={participantListContainerRef}
          >
            {participants.map((participant, i) => {
              return (
                <ParticipantRow
                  key={i}
                  options={options}
                  name={participant.name}
                  votes={participant.votes}
                  editMode={editingParticipantId === participant.id}
                  onChangeEditMode={(isEditing) => {
                    setEditingParticipantId(isEditing ? participant.id : null);
                    if (isEditing) {
                      setShouldShowNewParticipantForm(false);
                    }
                  }}
                  isYou={participant.you}
                  isEditable={participant.editable}
                  onChange={async (update) => {
                    await onUpdateEntry?.(participant.id, update);
                  }}
                  onDelete={async () => {
                    await onDeleteEntry?.(participant.id);
                  }}
                />
              );
            })}
          </div>
        ) : null}
        {onEntry && shouldShowNewParticipantForm ? (
          <ParticipantRowForm
            options={options}
            className="border-t bg-gray-50"
            onSubmit={async (data) => {
              await onEntry(data);
            }}
          />
        ) : null}
        {!poll.closed ? (
          <div className="flex h-14 shrink-0 items-center rounded-b-lg border-t bg-gray-50 px-3">
            {shouldShowNewParticipantForm || editingParticipantId ? (
              <div className="flex items-center space-x-3">
                <Button
                  key="submit"
                  form="participant-row-form"
                  htmlType="submit"
                  type="primary"
                  icon={<Check />}
                  loading={isBusy}
                >
                  {t("save")}
                </Button>
                <Button
                  onClick={() => {
                    if (editingParticipantId) {
                      setEditingParticipantId(null);
                    } else {
                      setShouldShowNewParticipantForm(false);
                    }
                  }}
                >
                  {t("cancel")}
                </Button>
                <div className="text-sm">
                  <Trans
                    t={t}
                    i18nKey="saveInstruction"
                    values={{
                      save: t("save"),
                    }}
                    components={{ b: <strong /> }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center space-x-3">
                <Button
                  key="add-participant"
                  onClick={() => {
                    setShouldShowNewParticipantForm(true);
                  }}
                  icon={<Plus />}
                >
                  {t("addParticipant")}
                </Button>
                {userAlreadyVoted ? (
                  <div className="flex items-center text-sm text-gray-400">
                    <Check className="mr-1 h-5" />
                    <div>{t("alreadyVoted")}</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </PollContext.Provider>
  );
};

const Resizer: React.VoidFunctionComponent<PollProps> = (props) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  return (
    <div ref={ref} className="w-full overflow-hidden">
      {width > 0 ? <TableViewPoll {...props} width={width} /> : null}
    </div>
  );
};

export default Resizer;
