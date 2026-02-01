/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as analytics from "../analytics.js";
import type * as chat from "../chat.js";
import type * as experiences from "../experiences.js";
import type * as media from "../media.js";
import type * as messages from "../messages.js";
import type * as profile from "../profile.js";
import type * as projects from "../projects.js";
import type * as resumes from "../resumes.js";
import type * as settings from "../settings.js";
import type * as skills from "../skills.js";
import type * as socials from "../socials.js";
import type * as tools from "../tools.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  analytics: typeof analytics;
  chat: typeof chat;
  experiences: typeof experiences;
  media: typeof media;
  messages: typeof messages;
  profile: typeof profile;
  projects: typeof projects;
  resumes: typeof resumes;
  settings: typeof settings;
  skills: typeof skills;
  socials: typeof socials;
  tools: typeof tools;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
