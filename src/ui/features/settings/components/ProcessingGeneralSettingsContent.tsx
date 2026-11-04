/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { Checkbox, Divider, Paper, Select, Stack, Text } from "@mantine/core";
import {
    getDownsamplingStrategyOptions,
    type DownsamplingStrategy,
} from "../../processing/downsampling/domain/DownsamplingStrategy";
import { getResolutionLevelOptions } from "../../processing/resolution/domain/ResolutionLevel";
import { useProcessingSettings } from "../hooks/useProcessingSettings";

export function ProcessingGeneralSettingsContent() {
    const { getGlobalProcessingSettings, setGlobalExportProcessingSettings } =
        useProcessingSettings();

    // Render the component.
    return (
        <Stack gap="md" style={{ maxWidth: 480 }}>
            <Paper withBorder p="md">
                <Text fw={600} size="md" mb="xs">
                    Processing workflow
                </Text>

                <Divider mb="md" />

                <Checkbox
                    label="On-Load-Processing"
                    description="When enabled, each local asset is processed immediately when it is added, instead of later during MVSX export."
                    checked={getGlobalProcessingSettings().onLoadProcessing ?? "false"} // onLoadProcessing is alwasy defined, but Mantine has bug in this, so we needed to provide some default value for first render.
                    onChange={(e) =>
                        setGlobalExportProcessingSettings(
                            e.currentTarget.checked,
                            getGlobalProcessingSettings().exportProcessing
                                .volumeDownsamplingStrategy,
                            getGlobalProcessingSettings().exportProcessing
                                .segmentationDownsamplingStrategy,
                            getGlobalProcessingSettings().exportProcessing.resolution,
                        )
                    }
                    size="sm"
                />
            </Paper>

            <Paper withBorder p="md">
                <Text fw={600} size="md" mb="xs">
                    Default export processing
                </Text>

                <Divider mb="md" />

                <Stack gap="md" style={{ maxWidth: 480 }}>
                    <Select
                        label="Volume downsampling method"
                        description="Used when the export processes files of multiple formats within one processing call, or a format without its own per-format settings."
                        data={getDownsamplingStrategyOptions()}
                        value={
                            getGlobalProcessingSettings().exportProcessing
                                .volumeDownsamplingStrategy
                        }
                        allowDeselect={false}
                        onChange={(value) =>
                            value &&
                            setGlobalExportProcessingSettings(
                                getGlobalProcessingSettings().onLoadProcessing,
                                value as DownsamplingStrategy,
                                getGlobalProcessingSettings().exportProcessing
                                    .segmentationDownsamplingStrategy,
                                getGlobalProcessingSettings().exportProcessing.resolution,
                            )
                        }
                    />

                    <Select
                        label="Segmentation downsampling method"
                        description="Used when the export processes files of multiple formats within one processing call, or a format without its own per-format settings."
                        data={getDownsamplingStrategyOptions()}
                        value={
                            getGlobalProcessingSettings().exportProcessing
                                .segmentationDownsamplingStrategy
                        }
                        allowDeselect={false}
                        onChange={(value) =>
                            value &&
                            setGlobalExportProcessingSettings(
                                getGlobalProcessingSettings().onLoadProcessing,
                                getGlobalProcessingSettings().exportProcessing
                                    .volumeDownsamplingStrategy,
                                value as DownsamplingStrategy,
                                getGlobalProcessingSettings().exportProcessing.resolution,
                            )
                        }
                    />

                    <Select
                        label="Resolution"
                        description="Resolution of the processed volume embedded into the export."
                        data={getResolutionLevelOptions()}
                        value={getGlobalProcessingSettings().exportProcessing.resolution}
                        allowDeselect={false}
                        onChange={(value) =>
                            value &&
                            setGlobalExportProcessingSettings(
                                getGlobalProcessingSettings().onLoadProcessing,
                                getGlobalProcessingSettings().exportProcessing
                                    .volumeDownsamplingStrategy,
                                getGlobalProcessingSettings().exportProcessing
                                    .segmentationDownsamplingStrategy,
                                value,
                            )
                        }
                    />
                </Stack>
            </Paper>
        </Stack>
    );
}
