/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button, type ButtonProps } from "@mantine/core";
import classes from "./GhostButton.module.css";

type Props = ButtonProps & ComponentPropsWithoutRef<"button">;

export const GhostButton = forwardRef<HTMLButtonElement, Props>(
    ({ loaderProps, ...props }, ref) => (
        <Button
            ref={ref}
            {...props}
            variant="ghost"
            classNames={{ root: classes.ghost }}
            loaderProps={{ color: "var(--mantine-primary-color-filled)", ...loaderProps }}
        />
    ),
);
GhostButton.displayName = "GhostButton";
