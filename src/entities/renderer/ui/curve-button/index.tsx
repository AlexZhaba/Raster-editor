import { Button, Checkbox, Flex, Input, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  registerables,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getRgbStatisticByDrawable,
  loadImageToCanvasByFile,
  updateCanvasByCurve,
} from "../../model";
import {
  ButtonGrid,
  HistorgramContainer,
  ModalContainer,
  PreviewContainer,
  PreviewEmpty,
} from "./styles";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import {
  getCurveLine,
  toneCorrectionByCurveLine,
} from "../../../../shared/lib";
import { Preview } from "./preview";

Chart.register(...registerables);

export const CurveButton = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const rgbData = useAppSelector((state) => state.canvasSlice.rgbStat);
  const renderer = useAppSelector((state) => state.canvasSlice.renderer);

  const lineRef = useRef<ChartJSOrUndefined<"line", any>>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [startX, setStartX] = useState(25);
  const [startY, setStartY] = useState(25);
  const [endX, setEndX] = useState(230);
  const [endY, setEndY] = useState(230);

  const [previewData, setPreviewData] = useState<ImageData>();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("dispatch");
    dispatch(getRgbStatisticByDrawable(0));
  }, [dispatch, isCanvasEmpty, isModalOpen]);

  const curveLine = useMemo(() => {
    return getCurveLine({
      startX,
      startY,
      endX,
      endY,
    });
  }, [endX, endY, startX, startY]);

  const histogramDatasets: ChartDataset<"line", any>[] = useMemo<
    ChartDataset<"line", any>[]
  >(
    () =>
      !rgbData
        ? []
        : [
            {
              data: curveLine,
              borderColor: "black",
              borderWidth: 1,
              pointRadius: 1,
            },
            {
              label: "R",
              data: rgbData.r,
              backgroundColor: "red",
              borderColor: "red",
              borderWidth: 2,
              pointRadius: 1,
            },
            {
              label: "G",
              data: rgbData.g,
              backgroundColor: "green",
              borderColor: "green",
              borderWidth: 2,
              pointRadius: 1,
            },
            {
              label: "B",
              data: rgbData.b,
              backgroundColor: "blue",
              borderColor: "blue",
              borderWidth: 2,
              pointRadius: 1,
            },
          ],
    [endX, endY, rgbData, startX, startY]
  );

  const data: ChartData<"line"> = {
    labels: new Array(256).fill(0).map((_, i) => i),
    datasets: histogramDatasets,
  };

  const options: ChartOptions<"line"> = {
    plugins: {
      title: {
        text: "RGB histogram",
        display: true,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 16,
        },
      },
      x: {
        ticks: {
          stepSize: 16,
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  useEffect(() => {
    if (startX >= endX) {
      setStartX(0);
    }

    const values = [
      [startX, setStartX],
      [startY, setStartY],
      [endX, setEndX],
      [endY, setEndY],
    ] as const;
    for (const [value, setValue] of values) {
      if (value > 256) {
        setValue(256);
      }
    }
  }, [endX, endY, startX, startY]);

  const updatePrewiewData = async () => {
    const result = await renderer?.getDrawable(0)?.getData();
    if (!result) return;
    setPreviewData(toneCorrectionByCurveLine(result, curveLine));
  };

  const handleResetButton = () => {
    setStartX(25);
    setStartY(25);
    setEndX(230);
    setEndY(230);
  };

  const handleModalOk = () => {
    dispatch(updateCanvasByCurve(curveLine));
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!renderer) return;
    void updatePrewiewData();
  }, [renderer, isModalOpen, histogramDatasets]);

  return (
    <>
      <Button
        type="primary"
        disabled={isCanvasEmpty}
        onClick={handleButtonClick}
      >
        Curve
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        title={"Curve"}
        width={1000}
      >
        <ModalContainer>
          <div>
            <HistorgramContainer>
              <Line
                data={data}
                options={options}
                ref={lineRef}
                width={400}
                height={400}
                title={"RGB diagram"}
              />
            </HistorgramContainer>

            <ButtonGrid>
              <span>Input</span>
              <Input
                type="number"
                value={startX}
                max={256}
                onInput={(event) =>
                  setStartX(Number(event.currentTarget.value))
                }
              />
              <Input
                value={endX}
                type="number"
                max={256}
                onInput={(event) => setEndX(Number(event.currentTarget.value))}
              />
              <span>Output</span>
              <Input
                type="number"
                max={256}
                value={startY}
                onInput={(event) =>
                  setStartY(Number(event.currentTarget.value))
                }
              />
              <Input
                type="number"
                value={endY}
                max={256}
                onInput={(event) => setEndY(Number(event.currentTarget.value))}
              />
            </ButtonGrid>
            <Flex align="center" gap={16}>
              <Button onClick={handleResetButton}>Reset</Button>
              <Checkbox
                value={isPreviewOpen}
                onChange={(val) => {
                  setIsPreviewOpen(val.target.checked);
                }}
              >
                <span>Show preview</span>
              </Checkbox>
            </Flex>
          </div>
          <PreviewContainer>
            {previewData && isPreviewOpen ? (
              <Preview drawableData={previewData} />
            ) : (
              <PreviewEmpty>
                <span>Press "Show preview" to look result</span>
              </PreviewEmpty>
            )}
          </PreviewContainer>
        </ModalContainer>
      </Modal>
    </>
  );
};
