/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { useCallback, useState } from "react";
import { MVSData } from "molstar/lib/extensions/mvs/mvs-data";
import { pushWarningNotification } from "../../../notifications/services/NotificationService";
import { PreformattedText } from "../../../../components/common/preformatted-text/PreformattedText";
import { useRegimeStore } from "../../../regime/stores/regimeStore";
import { CopyButton } from "../../../../components/common/buttons/CopyButton";

export function ShowMVSTreeDialogueContent() {
    // Use regime.
    const regime = useRegimeStore((state) => state.regime);

    // State for holding information if MVS tree was copied.
    const [copied, setCopied] = useState(false);

    // Handler for copy action.
    const handleCopy = useCallback(async () => {
        if (regime.kind !== "viewing") return;

        try {
            const prettyString = MVSData.toPrettyString(
                regime.history.current().stateTree,
            );
            await navigator.clipboard.writeText(prettyString);
            setCopied(true);
        } catch (error) {
            pushWarningNotification(`Failed to copy the MVS tree! Details: <${error}>.`);
        }
    }, [regime]);

    if (regime.kind !== "viewing") {
        return null;
    }

    // Render the component.
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
            }}
        >
            {/* Preformatted text of MVS tree. */}
            <PreformattedText>
                {MVSData.toPrettyString(regime.history.current().stateTree)}
            </PreformattedText>

            {/* Buttons. */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2em",
                    paddingTop: "1em",
                }}
            >
                <CopyButton
                    title="Copies the MVS tree."
                    copied={copied}
                    onClick={handleCopy}
                />
            </div>
        </div>
    );
}
