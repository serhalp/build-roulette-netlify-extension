import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { procedure, router } from "./trpc.js";

export const appRouter = router({
  deploy: {
    cancel: procedure
      .input(z.object({ deployId: z.string() }))
      .mutation(async ({ ctx: { client }, input: { deployId } }) => {
        if (!deployId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "deployId is required",
          });
        }

        try {
          await client.cancelSiteDeploy(deployId);
        } catch (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to cancel deploy",
            cause: err,
          });
        }
      }),
  },
});

export type AppRouter = typeof appRouter;
