import { inferProcedureOutput } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { ServerRouter, serverRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

export default trpcNext.createNextApiHandler({
  router: serverRouter,
  createContext,
});

export type inferQueryResponse<
  TRouteKey extends keyof ServerRouter["_def"]["queries"]
> = inferProcedureOutput<ServerRouter["_def"]["queries"][TRouteKey]>;
