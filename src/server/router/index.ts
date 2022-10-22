import * as trpc from "@trpc/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { Context } from "./context";

export const serverRouter = trpc
  .router<Context>()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.shortLink.findMany();
    },
  })
  .mutation("addOne", {
    input: z.object({
      slug: z.string().optional(),
      url: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const slug = input.slug || nanoid(14);
      return await ctx.prisma.shortLink.create({
        data: { slug, url: input.url },
      });
    },
  })
  .mutation("removeOne", {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.shortLink.delete({
        where: { id: input.id },
      });
    },
  });

export type ServerRouter = typeof serverRouter;
