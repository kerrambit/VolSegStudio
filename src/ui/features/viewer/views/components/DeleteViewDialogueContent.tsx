/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { DangerButton } from "../../../../components/common/buttons/DangerButton";
import { GhostButton } from "../../../../components/common/buttons/GhostButton";

interface DeleteViewDialogueContentProps {
    viewName: string;
    close: (value?: boolean) => void;
}

export function DeleteViewDialogueContent({
    viewName,
    close,
}: DeleteViewDialogueContentProps) {
    // Render the component.
    return (
        <>
            <p style={{ marginBottom: "1rem" }}>
                {`Do you really want to delete '${viewName}' view?`}
            </p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                }}
            >
                <GhostButton title="Cancels the deletion." onClick={() => close(false)}>
                    Cancel
                </GhostButton>
                <DangerButton title="Deletes the view." onClick={() => close(true)}>
                    Delete view
                </DangerButton>
            </div>
        </>
    );
}
