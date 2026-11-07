/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { Text } from "@mantine/core";
import { GhostButton } from "../../../components/common/buttons/GhostButton";

interface SimpleDialogueContentProps {
    close: () => void;
    title?: string;
    message?: string;
}

export function SimpleDialogueContent({
    close,
    title,
    message,
}: SimpleDialogueContentProps) {
    return (
        <>
            <Text size="xl" fw={700} mb="xs">
                {title}
            </Text>
            <Text>{message}</Text>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "1em",
                }}
            >
                <GhostButton
                    title="Closes the dialogue."
                    size="sm"
                    onClick={() => close()}
                >
                    OK
                </GhostButton>
            </div>
        </>
    );
}
