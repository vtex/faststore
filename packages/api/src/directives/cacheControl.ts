import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { GraphQLSchema } from "graphql";

import type { Directive } from "./index";

const NAME = "cacheControl";

export interface CacheControl {
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  scope?: string;
}

export const stringify = (
  { scope = "private", sMaxAge = 0, staleWhileRevalidate = 0 }: CacheControl,
) =>
  `${scope}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;

const min = (a: number | undefined, b: number | undefined) => {
  if (typeof a === "number" && typeof b === "number") {
    return a > b ? b : a;
  }

  if (typeof a === "number") {
    return a;
  }

  return b;
};

const minScope = (
  a: string | undefined,
  b: string | undefined,
) => {
  if (typeof a === "string" && typeof b === "string") {
    return a === "public" && b === "public" ? "public" : "private";
  }

  return a || b;
};

const directive: Directive = {
  typeDefs:
    `directive @cacheControl(sMaxAge: Int, staleWhileRevalidate: Int, scope: String) on FIELD_DEFINITION`,
  transformer: (schema: GraphQLSchema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const cacheControl = getDirective(schema, fieldConfig, NAME)?.[0] as
          | CacheControl
          | undefined;

        if (cacheControl) {
          const { sMaxAge, staleWhileRevalidate, scope } = cacheControl;

          const resolver = fieldConfig.resolve

          fieldConfig.resolve = (obj, args, ctx, info) => {
            ctx.cacheControl = {
              sMaxAge: min(ctx.cacheControl?.sMaxAge, sMaxAge),
              staleWhileRevalidate: min(
                ctx.cacheControl?.staleWhileRevalidate,
                staleWhileRevalidate,
              ),
              scope: minScope(ctx.cacheControl?.scope, scope),
            };

            return resolver?.(obj, args, ctx, info);
          };
        }

        return fieldConfig;
      },
    }),
};

export default directive;
