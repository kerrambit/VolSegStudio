/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

/**
 * Extracts a human-readable message from anything that can be thrown.
 * @param err caught value (`unknown`)
 * @returns error message
 */
export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;

    if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
    ) {
        return err.message;
    }

    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}
