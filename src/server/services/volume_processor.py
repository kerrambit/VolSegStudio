#
# Copyright (c) 2025-now VolSegStudio contributors, licensed under MIT, See LICENSE file for more info.
#
# @author Marek Eibel
#

import asyncio
import shutil
from pathlib import Path
from typing import List, Optional

import volsegtools

from server.models.volume import (
    DownsamplignAlgorithmKind,
    ProcessVolumeProgressMessage,
    SerializerKind,
    BundlingKind,
)
from server.services.jobs_manager import ProcessVolumeJob


class Preprocessor:
    OVERWRITE_TMP = True
    RM_TMP = False

    @staticmethod
    def get_serializer(kind: SerializerKind):
        match kind:
            case SerializerKind.BCIF:
                return volsegtools.BCIFSerializer()
            case SerializerKind.MRC:
                return volsegtools.MRCSerializer()
            case SerializerKind.OBJ:
                return volsegtools.OBJSerializer()
            case SerializerKind.PLY:
                return volsegtools.PLYSerializer()
            case SerializerKind.STL:
                return volsegtools.STLSerializer()
            case _:
                raise RuntimeError("Unknown kind encountered")

    @staticmethod
    def get_downsampling_strategy(kind: DownsamplignAlgorithmKind):
        match kind:
            case DownsamplignAlgorithmKind.NEAREST_NEIGHBOR:
                return volsegtools.NearestNeighbor()
            case DownsamplignAlgorithmKind.MAX:
                return volsegtools.MaxPooling()
            case DownsamplignAlgorithmKind.MIN:
                return volsegtools.MinPooling()
            case DownsamplignAlgorithmKind.AVG:
                return volsegtools.AveragePooling()
            case DownsamplignAlgorithmKind.TRILINEAR:
                return volsegtools.TrilinearInterpolation()
            case DownsamplignAlgorithmKind.TRICUBIC:
                return volsegtools.TricubicInterpolation()
            case DownsamplignAlgorithmKind.TRIQUINTIC:
                return volsegtools.TriquinticInterpolation()
            case DownsamplignAlgorithmKind.TRIQUINTIC_NO_SMOOTH:
                return volsegtools.TriquinticInterpolation()
            case DownsamplignAlgorithmKind.SMOOTHING:
                return volsegtools.Smoothing()
            case DownsamplignAlgorithmKind.STRIDED_SMOOTHING:
                return volsegtools.StridedSmoothing(volsegtools.Gaussian3DKernel(5, 1))
            case DownsamplignAlgorithmKind.SEPARATED_SMOOTHING:
                return volsegtools.SeparatedSmoothing(5, 1)
            case DownsamplignAlgorithmKind.NULL:
                return volsegtools.Null()
            case _:
                return volsegtools.Null()

    @staticmethod
    async def process_volume(
        job: ProcessVolumeJob,
        temporary_directory: str,
        volume_filepaths: List[str],
        volume_downsampling_strategy: DownsamplignAlgorithmKind,
        volume_serializer: SerializerKind,
        segmentation_downsampling_strategy: DownsamplignAlgorithmKind,
        segmentations_filepaths: List[str],
        segmentation_mask_serializer: SerializerKind,
        segmentation_volume_serializer: SerializerKind,
        segmentation_mesh_serializer: SerializerKind,
        bundling_approach: BundlingKind,
        output_path: Optional[str] = None,
    ):

        local_store_path = Path(temporary_directory) / job.id / "RawData"
        output_dir = (
            Path(output_path)
            if output_path
            else Path(temporary_directory) / job.id / "Output"
        )

        try:
            volume_source: List[Path] = [Path(path) for path in volume_filepaths]
            segmentation_source: List[Path] = [
                Path(path) for path in segmentations_filepaths
            ]

            if Preprocessor.OVERWRITE_TMP and local_store_path.exists():
                shutil.rmtree(local_store_path, ignore_errors=True)

            local_store_path.mkdir(parents=True, exist_ok=True)
            output_dir.mkdir(parents=True, exist_ok=True)

            # Create a marker file identifying proper Procesing temporary folder.
            MARKER = ".volsegstudio-processing"
            (Path(temporary_directory) / MARKER).touch(exist_ok=True)

            builder = volsegtools.create_builder()
            (
                builder.add_volume_converter(volsegtools.MRCConverter())
                .add_volume_converter(volsegtools.TIFFConverter())
                .add_volume_converter(volsegtools.NGFFConverter())
                .add_volume_converter(volsegtools.ImarisConverter())
                .add_volume_converter(volsegtools.CIFConverter())
                .add_segmentation_converter(volsegtools.MeshConverter())
                .add_segmentation_converter(volsegtools.NiiConverter())
                .add_segmentation_converter(volsegtools.MRCConverter())
                .add_segmentation_converter(volsegtools.SFFConverter())
                .add_segmentation_converter(volsegtools.VRMLConverter())
                .add_segmentation_converter(volsegtools.CIFConverter())
                .set_downsampling_strategy(
                    Preprocessor.get_downsampling_strategy(
                        volume_downsampling_strategy
                    ),
                    volsegtools.DataKind.VOLUME,
                )
                .set_downsampling_strategy(
                    Preprocessor.get_downsampling_strategy(
                        segmentation_downsampling_strategy
                    ),
                    volsegtools.DataKind.SEGMENTATION_MASK,
                )
                .set_downsampling_strategy(
                    Preprocessor.get_downsampling_strategy(
                        segmentation_downsampling_strategy
                    ),
                    volsegtools.DataKind.SEGMENTATION_MESH,
                )
                .set_downsampling_strategy(
                    Preprocessor.get_downsampling_strategy(
                        segmentation_downsampling_strategy
                    ),
                    volsegtools.DataKind.SEGMENTATION_VOLUME,
                )
                .set_serializer(
                    Preprocessor.get_serializer(volume_serializer),
                    volsegtools.DataKind.VOLUME,
                )
                .set_serializer(
                    Preprocessor.get_serializer(segmentation_mask_serializer),
                    volsegtools.DataKind.SEGMENTATION_MASK,
                )
                .set_serializer(
                    Preprocessor.get_serializer(segmentation_volume_serializer),
                    volsegtools.DataKind.SEGMENTATION_VOLUME,
                )
                .set_serializer(
                    Preprocessor.get_serializer(segmentation_mesh_serializer),
                    volsegtools.DataKind.SEGMENTATION_MESH,
                )
                .set_output_dir(output_dir)
            )

            builder.set_local_store_path(local_store_path)

            match bundling_approach:
                case BundlingKind.MVXS:
                    builder.set_bundler(volsegtools.MVSXBundler())
                case BundlingKind.RESOLUTION_ZIP:
                    builder.set_bundler(volsegtools.ResolutionZipBundler())
                case BundlingKind.ZIP:
                    builder.set_bundler(volsegtools.ZipBundler())

            trquintic_post_process_steps: list[volsegtools.DataKind] = []
            if volume_downsampling_strategy == DownsamplignAlgorithmKind.TRIQUINTIC:
                trquintic_post_process_steps.append(volsegtools.DataKind.VOLUME)

            if (
                segmentation_downsampling_strategy
                == DownsamplignAlgorithmKind.TRIQUINTIC
            ):
                trquintic_post_process_steps.extend(
                    [
                        volsegtools.DataKind.SEGMENTATION_MASK,
                        volsegtools.DataKind.SEGMENTATION_VOLUME,
                        volsegtools.DataKind.SEGMENTATION_MESH,
                    ],
                )

            if len(trquintic_post_process_steps) > 0:
                builder.add_post_process_step(
                    volsegtools.SmoothingStep(trquintic_post_process_steps)
                )

            if (
                volume_downsampling_strategy == DownsamplignAlgorithmKind.NULL
            ):  # TODO: should we check here only volume strategy?
                builder.keep_original(True)

            builder.set_downsampling_size_threshold(
                volsegtools.Bytes("5KB")
            )  # Set lower file size threshold to 5KB.

            loop = asyncio.get_event_loop()

            def update_status(state):
                loop.call_soon_threadsafe(
                    job.queue.put_nowait,
                    ProcessVolumeProgressMessage(stage=state.stage),
                )

            def run_pipeline_blocking():
                pipeline: volsegtools.ProcessingPipeline = builder.build()
                pipeline.add_state_change_callback(update_status)
                return pipeline.sync_process(
                    volume_files=volume_source, segmentation_files=segmentation_source
                )

            result = await loop.run_in_executor(None, run_pipeline_blocking)
            job.result = list(map(str, result))

        except Exception as err:
            job.error = str(err)

        finally:
            try:
                volsegtools.Timer.pop_stage()
            except Exception as e:
                print(f"Timer pop warning: {e}")

            if Preprocessor.RM_TMP and local_store_path.exists():
                shutil.rmtree(local_store_path, ignore_errors=True)

            job.done = True

            await job.queue.put(
                ProcessVolumeProgressMessage(
                    stage="done", error=job.error, result=job.result
                )
            )
