import * as trpcNext from "@trpc/server/adapters/next";

import { getCurrentUser } from "../utils/auth";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const user = await getCurrentUser(opts);

  return { user, session: opts.req.session };
}
