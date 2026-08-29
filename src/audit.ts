import { mapFilter, raise, typedKeys, typedToEntries } from "niall-utils";

import { IndexError } from "./error.ts";
import type { Stats, Target, TargetMap } from "./types.ts";

export class Audit {
  private readonly allStats: TargetMap<Stats>;

  constructor(stats: TargetMap<Stats>) {
    this.allStats = stats;
  }

  /**
   * Get the stats of a given target/methodName pair
   * @param {Target} target
   * @param {PropertyKey} methodName
   * @returns {Stats}
   */
  getStats(target: Target, methodName: PropertyKey): Stats {
    return (
      this.allStats.get(target)?.methods[methodName] ??
      raise(new IndexError("Method name does not exist on target"))
    );
  }

  /**
   * Generator which iterates over all the targets inside the stats
   * @yields {Target} Current target
   */
  *targets(): Generator<Target> {
    for (const target of this.allStats.keys()) yield target;
  }

  /**
   * Generator which iterates over the target's methodNames
   * @param {Target} target
   * @yields {PropertyKey} Current methodName
   */
  *properties(target: Target): Generator<PropertyKey> {
    const methodNames =
      this.allStats.get(target)?.methods ??
      raise(new IndexError("Target does not exist"));

    for (const methodName of typedKeys(methodNames, true)) yield methodName;
  }

  /**
   * Iterates over the audited stats
   * @param {function({calls: number, executionTime: number, minDebugLevel: number}, Target, PropertyKey): void} callbackFn
   */
  forEach(
    callbackFn: (
      this: Audit,
      stats: Stats,
      target: Target,
      methodName: PropertyKey
    ) => void
  ): void {
    this.allStats.entries().forEach(([target, methodStats]) => {
      typedToEntries(methodStats.methods, true).forEach(
        ([methodName, stats]) => {
          callbackFn.call(this, stats, target, methodName);
        }
      );
    });
  }

  /**
   * Prettifies the audit so you can log it out
   * @param {number | undefined} digits Number length in digits
   * @returns {string}
   */
  toString(digits?: number): string {
    const formatNumber = (n: number): string =>
      digits != null
        ? n.toExponential(digits)
        : [`${n}`, n.toExponential()].reduce((a, b) =>
            a.length < b.length ? a : b
          );

    const sections = mapFilter(
      Array.from(this.allStats.values()),
      ({ targetName, methods }) => {
        const lines = mapFilter(
          typedToEntries(methods, true),
          ([methodName, { calls, executionTime }]) =>
            calls > 0
              ? `  - ${methodName.toString()} Calls:${formatNumber(
                  calls
                )} Execution Time: ${formatNumber(
                  executionTime
                )}ms Average Execution Time: ${formatNumber(
                  executionTime / calls
                )}ms`
              : null
        );

        return lines.length > 0
          ? `===== ${targetName} =====\n${lines.join("\n")}`
          : null;
      }
    );

    return sections.join("\n\n");
  }
}
