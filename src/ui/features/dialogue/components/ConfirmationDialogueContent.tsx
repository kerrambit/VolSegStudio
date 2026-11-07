import { Group, Text } from "@mantine/core";
import { DangerButton } from "../../../components/common/buttons/DangerButton";
import { GhostButton } from "../../../components/common/buttons/GhostButton";

interface ConfirmationDialogueContentProps {
    close: (value?: boolean) => void;
    doYouReallyWantToQuestion?: string;
}

export function ConfirmationDialogueContent({
    close,
    doYouReallyWantToQuestion,
}: ConfirmationDialogueContentProps) {
    return (
        <>
            <Text mb="md">
                You might have unsaved changes. {doYouReallyWantToQuestion}
            </Text>

            <Group justify="flex-end">
                <GhostButton title="No." onClick={() => close(false)} data-autofocus>
                    No
                </GhostButton>
                <DangerButton title="Yes." onClick={() => close(true)}>
                    Yes
                </DangerButton>
            </Group>
        </>
    );
}
