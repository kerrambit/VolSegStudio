/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { Text } from "@mantine/core";
import { GhostButton } from "../../../components/common/buttons/GhostButton";

interface ErrorDialogueContentProps {
    close: () => void;
    message?: string;
}

export function ErrorDialogueContent({ close, message }: ErrorDialogueContentProps) {
    return (
        <>
            <Text size="xl" fw={700} mb="xs">
                Error
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
