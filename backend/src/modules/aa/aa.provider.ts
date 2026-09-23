import { env } from "../../config/env.js";
import { MockAAProvider } from "./aa.mock.js";
import type { AccountAggregatorProvider } from "./aa.adapter.js";

export function createAAProvider(): AccountAggregatorProvider {
  switch (env.AA_PROVIDER) {
    case "mock":
      return new MockAAProvider();
    default:
      throw new Error(`Unsupported AA provider: ${env.AA_PROVIDER}`);
  }
}
