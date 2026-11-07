/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button, type ButtonProps } from "@mantine/core";
import classes from "./DangerButton.module.css";

type Props = ButtonProps & ComponentPropsWithoutRef<"button">;

export const DangerButton = forwardRef<HTMLButtonElement, Props>((props, ref) => (
    <Button ref={ref} {...props} variant="danger" classNames={{ root: classes.danger }} />
));
DangerButton.displayName = "DangerButton";
