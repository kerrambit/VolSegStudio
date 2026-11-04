/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import type { DownsamplingStrategy } from "../../processing/downsampling/domain/DownsamplingStrategy";
import type { ResolutionLevel } from "../../processing/resolution/domain/ResolutionLevel";

export type PerFormatProcessingSettingsEntry = {
    extension: string;
    requireProcessing: {
        volumeDownsamplingStrategy: DownsamplingStrategy;
        segmentationDownsamplingStrategy: DownsamplingStrategy;
    };
    previewProcessing: {
        volumeDownsamplingStrategy: DownsamplingStrategy;
        segmentationDownsamplingStrategy: DownsamplingStrategy;
        resolution: ResolutionLevel;
    };
    exportProcessing: {
        volumeDownsamplingStrategy: DownsamplingStrategy;
        segmentationDownsamplingStrategy: DownsamplingStrategy;
        resolution: ResolutionLevel;
    };
};
