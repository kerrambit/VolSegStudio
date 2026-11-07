/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button, type ButtonProps } from "@mantine/core";
import { IconCopy, IconCopyFilled } from "@tabler/icons-react";

type CopyButtonProps = Omit<ButtonProps, "children" | "leftSection"> &
    Omit<ComponentPropsWithoutRef<"button">, "children"> & {
        copied: boolean;
        copyLabel?: string;
        copiedLabel?: string;
    };

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
    (
        {
            copied,
            copyLabel = "Copy",
            copiedLabel = "Copied",
            variant = "filled",
            ...props
        },
        ref,
    ) => (
        <Button
            ref={ref}
            variant={variant}
            leftSection={copied ? <IconCopyFilled size={16} /> : <IconCopy size={16} />}
            {...props}
        >
            {copied ? copiedLabel : copyLabel}
        </Button>
    ),
);
CopyButton.displayName = "CopyButton";
