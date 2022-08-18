import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";

import Calendar from "@/components/icons/calendar.svg";
import Plus from "@/components/icons/plus-sm.svg";
import Search from "@/components/icons/search.svg";

import { AppLayout, AppLayoutHeading } from "../components/app-layout";
import FullPageLoader from "../components/full-page-loader";
import { TextInput } from "../components/text-input";
import { withUserSession } from "../components/user-provider";
import { withSessionSsr } from "../utils/auth";
import { useDayjs } from "../utils/dayjs";
import { trpc } from "../utils/trpc";
import { withPageTranslations } from "../utils/with-page-translations";

const Polls: React.VoidFunctionComponent = () => {
  const { t } = useTranslation("app");
  const [query, setQuery] = React.useState("");

  const { data } = trpc.useQuery(["polls.list"]);

  const { dayjs } = useDayjs();
  if (!data) {
    return <FullPageLoader>{t("loading")}</FullPageLoader>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        <div className="space-y-4 text-center">
          <Calendar className=" inline-block h-20" />
          <div className="">{t("pollsEmpty")}</div>
          <Link href="/new">
            <a className="btn-primary pr-4">
              <Plus className="-ml-1 mr-1 h-5" />
              {t("newPoll")}
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const polls = data.filter(({ title }) =>
    title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between space-x-8">
        <div className="flex space-x-4">
          <TextInput
            value={query}
            icon={Search}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-64"
          />
          <Link href="/new">
            <a className="btn-primary pr-4">
              <Plus className="-ml-1 mr-1 h-5" />
              {t("newPoll")}
            </a>
          </Link>
        </div>
        <div className="font-semibold">{polls.length} polls</div>
      </div>
      <div className="space-y-4">
        {polls.map((poll) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout="position"
              key={poll.id}
              className="flex rounded-lg border bg-white p-4"
            >
              <div className="mr-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500">
                  <Calendar className="h-5 text-white" />
                </div>
              </div>
              <div className="grow">
                <div className="flex justify-between space-x-2">
                  <Link href={`/admin/${poll.adminUrlId}`}>
                    <a className="font-semibold text-slate-700">{poll.title}</a>
                  </Link>
                </div>
                <div className="mb-4 text-slate-400">
                  {dayjs(poll.createdAt).format("LLL")}
                </div>
                <div className="flex space-x-4 text-xs font-bold">
                  <div className="text-slate-500">
                    {t("participantCount", { count: poll._count.participants })}
                  </div>
                  <div className="text-slate-500">
                    {t("commentCount", { count: poll._count.comments })}
                  </div>
                  {poll.closed ? (
                    <div className="text-blue-500">{t("locked")}</div>
                  ) : null}
                  <div className="text-slate-500">
                    {poll.notifications
                      ? t("notificationsOn")
                      : t("notificationsOff")}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const Page = () => {
  const { t } = useTranslation("app");

  return (
    <AppLayout title={t("meetingPolls")}>
      <AppLayoutHeading
        className="mb-4"
        title={t("meetingPolls")}
        description="Ask participants which days and times they are available to meet."
      />
      <Polls />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  withPageTranslations(["common", "app"]),
);

export default withUserSession(Page);
