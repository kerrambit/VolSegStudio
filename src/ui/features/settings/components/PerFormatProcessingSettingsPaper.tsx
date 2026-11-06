/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { Divider, Paper, Select, Stack, Text } from "@mantine/core";
import { getAssetConfig } from "../../assets/domain/assetsDefinitions";
import { getDownsamplingStrategyOptions } from "../../processing/downsampling/domain/DownsamplingStrategy";
import { getResolutionLevelOptions } from "../../processing/resolution/domain/ResolutionLevel";
import { useProcessingSettings } from "../hooks/useProcessingSettings";

interface PerFormatProcessingSettingsPaperProps {
    /**
     * Extension without dot, e.g. `"map"`.
     */
    extension: string;
}

export function PerFormatProcessingSettingsPaper({
    extension,
}: PerFormatProcessingSettingsPaperProps) {
    // Use processing settings.
    const {
        getPerFormatProcessingSettings,
        setPerFormatRequireProcessingDownsamplingMethod,
        setPerFormatPreviewProcessingSettings,
        setPerFormatExportProcessingSettings,
    } = useProcessingSettings();

    const entry = getPerFormatProcessingSettings(extension);
    const definition = getAssetConfig(extension);
    if (!definition) {
        return null;
    }

    const requiresProcessing = definition.requiresProcessing;
    const downsamplingMethodOptions = getDownsamplingStrategyOptions();
    const resolutionOptions = getResolutionLevelOptions();

    // Render the component.
    return (
        <Paper withBorder p="md">
            <Text fw={600} size="xl" mb="xs">
                .{extension}
            </Text>

            <Text size="sm" c="dimmed" mb="xs">
                {definition?.description ?? "Unknown format"}
            </Text>

            <Divider mb="md" />

            <Stack gap="md" style={{ maxWidth: 480 }}>
                {requiresProcessing && (
                    <>
                        <Text fw={500} size="xl">
                            Required processing
                        </Text>
                        <Select
                            label="Volume downsampling method"
                            description="Applied when the file cannot be opened directly and must be processed."
                            data={downsamplingMethodOptions}
                            value={entry.requireProcessing.volumeDownsamplingStrategy}
                            allowDeselect={false}
                            onChange={(value) =>
                                value &&
                                setPerFormatRequireProcessingDownsamplingMethod(
                                    extension,
                                    value,
                                    entry.requireProcessing
                                        .segmentationDownsamplingStrategy,
                                )
                            }
                        />
                        <Select
                            label="Segmentation downsampling method"
                            description="Applied when the file cannot be opened directly and must be processed."
                            data={downsamplingMethodOptions}
                            value={
                                entry.requireProcessing.segmentationDownsamplingStrategy
                            }
                            allowDeselect={false}
                            onChange={(value) =>
                                value &&
                                setPerFormatRequireProcessingDownsamplingMethod(
                                    extension,
                                    entry.requireProcessing.volumeDownsamplingStrategy,
                                    value,
                                )
                            }
                        />
                        <Divider mt="sm" />
                    </>
                )}

                <Text fw={500} size="xl">
                    Preview processing
                </Text>

                <Select
                    label="Volume downsampling method"
                    data={downsamplingMethodOptions}
                    value={entry.previewProcessing.volumeDownsamplingStrategy}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatPreviewProcessingSettings(
                            extension,
                            value,
                            entry.previewProcessing.segmentationDownsamplingStrategy,
                            entry.previewProcessing.resolution,
                        )
                    }
                />

                <Select
                    label="Segmentation downsampling method"
                    data={downsamplingMethodOptions}
                    value={entry.previewProcessing.segmentationDownsamplingStrategy}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatPreviewProcessingSettings(
                            extension,
                            entry.previewProcessing.volumeDownsamplingStrategy,
                            value,
                            entry.previewProcessing.resolution,
                        )
                    }
                />

                <Select
                    label="Resolution"
                    description="Resolution of the created preview."
                    data={resolutionOptions}
                    value={entry.previewProcessing.resolution}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatPreviewProcessingSettings(
                            extension,
                            entry.previewProcessing.volumeDownsamplingStrategy,
                            entry.previewProcessing.segmentationDownsamplingStrategy,
                            value,
                        )
                    }
                />

                <Divider mt="sm" />

                <Text fw={500} size="xl">
                    Export & On-Load processing
                </Text>

                <Select
                    label="Volume downsampling method"
                    description="Used when the export processes only files of this format. Or when working with Process-On-Load workflow (see Settings - Processing)."
                    data={downsamplingMethodOptions}
                    value={entry.exportProcessing.volumeDownsamplingStrategy}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatExportProcessingSettings(
                            extension,
                            value,
                            entry.exportProcessing.segmentationDownsamplingStrategy,
                            entry.exportProcessing.resolution,
                        )
                    }
                />

                <Select
                    label="Segmentation downsampling method"
                    description="Used when the export processes only files of this format. Or when working with Process-On-Load workflow (see Settings - Processing)."
                    data={downsamplingMethodOptions}
                    value={entry.exportProcessing.segmentationDownsamplingStrategy}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatExportProcessingSettings(
                            extension,
                            entry.exportProcessing.volumeDownsamplingStrategy,
                            value,
                            entry.exportProcessing.resolution,
                        )
                    }
                />

                <Select
                    label="Resolution"
                    description="Resolution of the processed volume embedded into the export."
                    data={resolutionOptions}
                    value={entry.exportProcessing.resolution}
                    allowDeselect={false}
                    onChange={(value) =>
                        value &&
                        setPerFormatExportProcessingSettings(
                            extension,
                            entry.exportProcessing.volumeDownsamplingStrategy,
                            entry.exportProcessing.segmentationDownsamplingStrategy,
                            value,
                        )
                    }
                />
            </Stack>
        </Paper>
    );
}
