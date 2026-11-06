/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { getAssetConfig } from "../../assets/domain/assetsDefinitions";
import type { DownsamplingStrategy } from "../../processing/downsampling/domain/DownsamplingStrategy";
import { parseDownsamplingStrategy } from "../../processing/downsampling/domain/parseDownsamplingStrategy";
import { parseResolutionLevel } from "../../processing/resolution/domain/parseResolutionLevel";
import type { ResolutionLevel } from "../../processing/resolution/domain/ResolutionLevel";
import {
    DEFAULT_REQUIRES_PROCESSING_DOWNSAMPLING_STRATEGY,
    DEFAULT_REQUIRES_PROCESSING_SEGMENTATION_DOWNSAMPLING_STRATEGY,
} from "../../processing/require/domain/constants";
import type { PerFormatProcessingSettingsEntry } from "./PerFormatProcessingSettingsEntry";
import type { ProcessingSettings } from "./ProcessingSettings";
import {
    DEFAULT_EXPORT_DOWNSAMPLING_STRATEGY,
    DEFAULT_EXPORT_RESOLUTION_LEVEL,
    DEFAULT_EXPORT_SEGMENTATION_DOWNSAMPLING_STRATEGY,
} from "../../processing/export/domain/constants";
import {
    DEFAULT_PREVIEW_DOWNSAMPLING_STRATEGY,
    DEFAULT_PREVIEW_RESOLUTION_LEVEL,
    DEFAULT_PREVIEW_SEGMENTATION_DOWNSAMPLING_STRATEGY,
} from "../../processing/preview/domain/constants";
import { ENABLE_ON_LOAD_PROCESSING } from "../../processing/domain/constants";

export function resolveProcessingSettings(
    settings?: UserSettings["processing"],
): ProcessingSettings {
    if (settings) {
        return {
            global: {
                onLoadProcessing: settings.global.onLoadProcessing,
                exportProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        settings.global.exportProcessing.volumeDownsamplingStrategy,
                        DEFAULT_EXPORT_DOWNSAMPLING_STRATEGY,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        settings.global.exportProcessing
                            .segmentationDownsamplingStrategy,
                        DEFAULT_EXPORT_SEGMENTATION_DOWNSAMPLING_STRATEGY,
                    ),
                    resolution: parseResolutionLevel(
                        settings.global.exportProcessing.resolution,
                        DEFAULT_EXPORT_RESOLUTION_LEVEL,
                    ),
                },
            },
            perFormat: (settings.perFormat || []).map((entry) => ({
                extension: entry.extension,
                requireProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.requireProcessing.volumeDownsamplingStrategy,
                        DEFAULT_REQUIRES_PROCESSING_DOWNSAMPLING_STRATEGY,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.requireProcessing.segmentationDownsamplingStrategy,
                        DEFAULT_REQUIRES_PROCESSING_SEGMENTATION_DOWNSAMPLING_STRATEGY,
                    ),
                },
                previewProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.previewProcessing.volumeDownsamplingStrategy,
                        DEFAULT_PREVIEW_DOWNSAMPLING_STRATEGY,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.previewProcessing.segmentationDownsamplingStrategy,
                        DEFAULT_PREVIEW_SEGMENTATION_DOWNSAMPLING_STRATEGY,
                    ),
                    resolution: parseResolutionLevel(
                        entry.previewProcessing.resolution,
                        DEFAULT_PREVIEW_RESOLUTION_LEVEL,
                    ),
                },
                exportProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.exportProcessing.volumeDownsamplingStrategy,
                        DEFAULT_EXPORT_DOWNSAMPLING_STRATEGY,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        entry.exportProcessing.segmentationDownsamplingStrategy,
                        DEFAULT_EXPORT_SEGMENTATION_DOWNSAMPLING_STRATEGY,
                    ),
                    resolution: parseResolutionLevel(
                        entry.exportProcessing.resolution,
                        DEFAULT_EXPORT_RESOLUTION_LEVEL,
                    ),
                },
            })),
        };
    }

    return {
        global: {
            onLoadProcessing: ENABLE_ON_LOAD_PROCESSING,
            exportProcessing: {
                volumeDownsamplingStrategy: DEFAULT_EXPORT_DOWNSAMPLING_STRATEGY,
                segmentationDownsamplingStrategy:
                    DEFAULT_EXPORT_SEGMENTATION_DOWNSAMPLING_STRATEGY,
                resolution: DEFAULT_EXPORT_RESOLUTION_LEVEL,
            },
        },
        perFormat: [],
    };
}

/**
 * Retrieves the stored per-format entry for the given extension, or the default
 * entry when the format has none stored yet.
 *
 * @param processing settings for processing
 * @param extension extension
 * @returns processing settings per format for `extension` asset
 */
export function getPerFormatEntry(
    processing: ProcessingSettings,
    extension: string,
    defaultRequiresProcessingDownsamplingStrategy: DownsamplingStrategy = DEFAULT_REQUIRES_PROCESSING_DOWNSAMPLING_STRATEGY,
    defaultRequiresProcessingSegmentationDownsamplingStrategy: DownsamplingStrategy = DEFAULT_REQUIRES_PROCESSING_SEGMENTATION_DOWNSAMPLING_STRATEGY,
    defaultPreviewDownsamplingStrategy: DownsamplingStrategy = DEFAULT_PREVIEW_DOWNSAMPLING_STRATEGY,
    defaultPreviewSegmentationDownsamplingStrategy: DownsamplingStrategy = DEFAULT_PREVIEW_SEGMENTATION_DOWNSAMPLING_STRATEGY,
    defaultPreviewResolutionLevel: ResolutionLevel = DEFAULT_PREVIEW_RESOLUTION_LEVEL,
    defaultExportDownsamplingStrategy: DownsamplingStrategy = DEFAULT_EXPORT_DOWNSAMPLING_STRATEGY,
    defaultExportSegmentationDownsamplingStrategy: DownsamplingStrategy = DEFAULT_EXPORT_SEGMENTATION_DOWNSAMPLING_STRATEGY,
    defaultExportResolutionLevel: ResolutionLevel = DEFAULT_EXPORT_RESOLUTION_LEVEL,
): PerFormatProcessingSettingsEntry {
    // Try to find the user's saved entry first.
    if (processing.perFormat) {
        const existingEntry = processing.perFormat.find(
            (entry) => entry.extension === extension,
        );
        if (existingEntry) {
            return {
                extension: extension,
                requireProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.requireProcessing.volumeDownsamplingStrategy,
                        defaultRequiresProcessingDownsamplingStrategy,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.requireProcessing.segmentationDownsamplingStrategy,
                        defaultRequiresProcessingSegmentationDownsamplingStrategy,
                    ),
                },
                previewProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.previewProcessing.volumeDownsamplingStrategy,
                        defaultPreviewDownsamplingStrategy,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.previewProcessing.segmentationDownsamplingStrategy,
                        defaultPreviewSegmentationDownsamplingStrategy,
                    ),
                    resolution: parseResolutionLevel(
                        existingEntry.previewProcessing.resolution,
                        defaultPreviewResolutionLevel,
                    ),
                },
                exportProcessing: {
                    volumeDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.exportProcessing.volumeDownsamplingStrategy,
                        defaultExportDownsamplingStrategy,
                    ),
                    segmentationDownsamplingStrategy: parseDownsamplingStrategy(
                        existingEntry.exportProcessing.segmentationDownsamplingStrategy,
                        defaultExportSegmentationDownsamplingStrategy,
                    ),
                    resolution: parseResolutionLevel(
                        existingEntry.exportProcessing.resolution,
                        defaultExportResolutionLevel,
                    ),
                },
            };
        }
    }

    // If not found, build a default entry from the asset configuration.
    const config = getAssetConfig(extension);
    if (config) {
        const requires = config.requiresProcessing;
        const offers = config.offersProcessing;

        return {
            extension: extension,
            requireProcessing: {
                volumeDownsamplingStrategy:
                    requires !== false
                        ? requires.volumeDownsamplingStrategy
                        : defaultRequiresProcessingDownsamplingStrategy,
                segmentationDownsamplingStrategy:
                    requires !== false
                        ? requires.segmentationDownsamplingStrategy
                        : defaultRequiresProcessingSegmentationDownsamplingStrategy,
            },
            previewProcessing: {
                volumeDownsamplingStrategy:
                    offers !== false
                        ? offers.previewProcessing.volumeDownsamplingStrategy
                        : defaultPreviewDownsamplingStrategy,
                segmentationDownsamplingStrategy:
                    offers !== false
                        ? offers.previewProcessing.segmentationDownsamplingStrategy
                        : defaultPreviewSegmentationDownsamplingStrategy,
                resolution:
                    offers !== false
                        ? offers.previewProcessing.resolution
                        : defaultPreviewResolutionLevel,
            },
            exportProcessing: {
                volumeDownsamplingStrategy:
                    offers !== false
                        ? offers.exportProcessing.volumeDownsamplingStrategy
                        : defaultExportDownsamplingStrategy,
                segmentationDownsamplingStrategy:
                    offers !== false
                        ? offers.exportProcessing.segmentationDownsamplingStrategy
                        : defaultExportSegmentationDownsamplingStrategy,
                resolution:
                    offers !== false
                        ? offers.exportProcessing.resolution
                        : defaultExportResolutionLevel,
            },
        };
    }

    // Absolute fallback if the extension is completely unknown.
    return {
        extension: extension,
        requireProcessing: {
            volumeDownsamplingStrategy: defaultRequiresProcessingDownsamplingStrategy,
            segmentationDownsamplingStrategy:
                defaultRequiresProcessingSegmentationDownsamplingStrategy,
        },
        previewProcessing: {
            volumeDownsamplingStrategy: defaultPreviewDownsamplingStrategy,
            segmentationDownsamplingStrategy:
                defaultPreviewSegmentationDownsamplingStrategy,
            resolution: defaultPreviewResolutionLevel,
        },
        exportProcessing: {
            volumeDownsamplingStrategy: defaultExportDownsamplingStrategy,
            segmentationDownsamplingStrategy:
                defaultExportSegmentationDownsamplingStrategy,
            resolution: defaultExportResolutionLevel,
        },
    };
}

/**
 * Resolves the export processing settings for the given extensions of the assets being processed.
 * When all assets share a single extension with per-format settings, those are used.
 * Otherwise (multiple extensions, or none) the global export processing settings are used,
 * because the export then processes all formats within a single processing call.
 *
 * Make sure all of extensions in `extensions` offer processing.
 *
 * @param processing processing part of the user settings
 * @param extensions extensions of all assets being processed, e.g. `["map", "map"]`
 * @returns the parsed, effective export processing settings
 */
export function resolveExportProcessingSettings(
    processing: ProcessingSettings,
    extensions: string[],
) {
    const uniqueExtensions = Array.from(new Set(extensions));
    const source =
        uniqueExtensions.length === 1
            ? getPerFormatEntry(processing, uniqueExtensions[0]).exportProcessing
            : {
                  volumeDownsamplingStrategy:
                      processing.global.exportProcessing.volumeDownsamplingStrategy,
                  segmentationDownsamplingStrategy:
                      processing.global.exportProcessing
                          .segmentationDownsamplingStrategy,

                  resolution: processing.global.exportProcessing.resolution,
              };

    return {
        volumeDownsamplingMethod: source.volumeDownsamplingStrategy,
        segmentationDownsamplingMethod: source.segmentationDownsamplingStrategy,
        resolution: source.resolution,
    };
}
