/**
 * Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Marek Eibel
 */

import { useUserSettingsStore } from "../stores/userSettingsStore";
import type { PerFormatProcessingSettingsEntry } from "../domain/PerFormatProcessingSettingsEntry";
import type { DownsamplingStrategy } from "../../processing/downsampling/domain/DownsamplingStrategy";
import type { ResolutionLevel } from "../../processing/resolution/domain/ResolutionLevel";
import {
    getPerFormatEntry,
    resolveProcessingSettings,
} from "../domain/resolveProcessingSettings";
import type { ProcessingSettings } from "../domain/ProcessingSettings";

export function useProcessingSettings() {
    // Use user settings.
    const settings = useUserSettingsStore((state) => state.settings);
    const setSettings = useUserSettingsStore((state) => state.setSettings);
    const processingSettings: ProcessingSettings = resolveProcessingSettings(
        settings.processing,
    );

    const getProcessignSettings = () => {
        return processingSettings;
    };

    const setGlobalExportProcessingSettings = (
        onLoadProcessing: boolean,
        volumeDownsamplingStrategy: DownsamplingStrategy,
        segmentationDownsamplingStrategy: DownsamplingStrategy,
        resolution: ResolutionLevel,
    ) => {
        setSettings({
            ...settings,
            processing: {
                ...processingSettings,
                global: {
                    onLoadProcessing: onLoadProcessing,
                    exportProcessing: {
                        volumeDownsamplingStrategy,
                        segmentationDownsamplingStrategy,
                        resolution,
                    },
                },
            },
        });
    };

    /**
     * Retrieves processing settings for asset format given by `extension`.
     * Note that it returns a default values also for formats, which actually do not `offer` nor `require` processing.
     * Similiary, it returns also default `requireProcessing` values for assets, which onyl `offer` processing.
     * Therefore, it is adviced to ask first if given format even supports processing.
     * @param extension extension
     * @returns per format processing settings
     */
    const getPerFormatProcessingSettings = (
        extension: string,
    ): PerFormatProcessingSettingsEntry => {
        return getPerFormatEntry(processingSettings, extension);
    };

    const getGlobalProcessingSettings = () => {
        return processingSettings.global;
    };

    const updatePerFormatEntry = (
        extension: string,
        update: (
            entry: PerFormatProcessingSettingsEntry,
        ) => PerFormatProcessingSettingsEntry,
    ) => {
        const current = getPerFormatProcessingSettings(extension);
        setSettings({
            ...settings,
            processing: {
                ...processingSettings,
                perFormat: [
                    ...processingSettings.perFormat.filter(
                        (entry) => entry.extension !== extension,
                    ),
                    update(current),
                ],
            },
        });
    };

    const setPerFormatRequireProcessingDownsamplingMethod = (
        extension: string,
        volumeDownsamplingStrategy: DownsamplingStrategy,
        segmentationDownsamplingStrategy: DownsamplingStrategy,
    ) => {
        updatePerFormatEntry(extension, (entry) => ({
            ...entry,
            requireProcessing: {
                volumeDownsamplingStrategy,
                segmentationDownsamplingStrategy,
            },
        }));
    };

    const setPerFormatPreviewProcessingSettings = (
        extension: string,
        volumeDownsamplingStrategy: DownsamplingStrategy,
        segmentationDownsamplingStrategy: DownsamplingStrategy,
        resolution: ResolutionLevel,
    ) => {
        updatePerFormatEntry(extension, (entry) => ({
            ...entry,
            previewProcessing: {
                volumeDownsamplingStrategy,
                segmentationDownsamplingStrategy,
                resolution,
            },
        }));
    };

    const setPerFormatExportProcessingSettings = (
        extension: string,
        volumeDownsamplingStrategy: DownsamplingStrategy,
        segmentationDownsamplingStrategy: DownsamplingStrategy,
        resolution: ResolutionLevel,
    ) => {
        updatePerFormatEntry(extension, (entry) => ({
            ...entry,
            exportProcessing: {
                volumeDownsamplingStrategy,
                segmentationDownsamplingStrategy,
                resolution,
            },
        }));
    };

    return {
        getProcessignSettings,
        getPerFormatProcessingSettings,
        getGlobalProcessingSettings,
        setGlobalExportProcessingSettings,
        setPerFormatRequireProcessingDownsamplingMethod,
        setPerFormatPreviewProcessingSettings,
        setPerFormatExportProcessingSettings,
    };
}
