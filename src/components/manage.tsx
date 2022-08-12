import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import React from "react";

import { AppLayoutHeading } from "./app-layout";
import { General } from "./manage/general";
import { Options } from "./manage/options";

const TabItem: React.VFC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Tab
      className={({ selected }) =>
        clsx(
          "border-b- -mb-[1px] h-12 border-b-2 px-1 font-medium",
          selected
            ? "border-b-primary-600 text-primary-600"
            : "border-b-transparent text-gray-500 hover:text-gray-600",
        )
      }
    >
      {children}
    </Tab>
  );
};

export const Manage: React.VFC = () => {
  const { t } = useTranslation("app");
  return (
    <div className="mt-8">
      <AppLayoutHeading
        title={t("manage")}
        description="Manage your poll details and settings"
      />
      <Tab.Group>
        <Tab.List className="mb-4 flex space-x-6 border-b">
          <TabItem>General</TabItem>
          <TabItem>Options</TabItem>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <General />
          </Tab.Panel>
          <Tab.Panel>
            <Options />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
