import { Button, Input, Modal } from "antd"
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, ChartData, ChartDataset, ChartOptions, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { getRgbStatisticByDrawable } from "../../model";
import { ButtonGrid, HistorgramContainer } from "./styles";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { getCurveLine } from "../../../../shared/lib";

Chart.register(...registerables);

export const CurveButton = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty);
  const rgbData = useAppSelector(state => state.canvasSlice.rgbStat)

  const lineRef = useRef<ChartJSOrUndefined<'line', any>>()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  }

  const handleModalCancel = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    console.log('dispatch')
    dispatch(getRgbStatisticByDrawable(0))
  }, [dispatch, isCanvasEmpty, isModalOpen])

  const histogramDatasets: ChartDataset<'line', any>[] = useMemo<ChartDataset<'line', any>[]>(() => !rgbData ? [] : [
    {
      data: getCurveLine({ startX: 25, startY: 25, endX: 230, endY: 230 }),
      borderColor: 'black',
      borderWidth: 4,
      pointRadius: 1,
    },
    {
      label: 'R',
      data: rgbData.r,
      backgroundColor: 'red',
      borderColor: 'red',
      borderWidth: 2,
      pointRadius: 1,
    },
    {
      label: 'G',
      data: rgbData.g,
      backgroundColor: 'green',
      borderColor: 'green',
      borderWidth: 2,
      pointRadius: 1,
    },
    {
      label: 'B',
      data: rgbData.b,
      backgroundColor: 'blue',
      borderColor: 'blue',
      borderWidth: 2,
      pointRadius: 1,
    },
  ], [rgbData])

  const data: ChartData<'line'> = {
    labels: new Array(256).fill(0).map((_, i) => i),
    datasets: histogramDatasets,
  };

  const options: ChartOptions<'line'> = {
    plugins: {
      title: {
        text: 'RGB digram',
        display: true,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      yAxis: {
        ticks: {
          stepSize: 16,
        },
      },
    }
  }


  return (
    <>
      <Button type="primary" disabled={isCanvasEmpty} onClick={handleButtonClick}>
        Curve
      </Button>
      <Modal open={isModalOpen} onCancel={handleModalCancel} title={"Curve"}>
        <HistorgramContainer>
          <Line data={data} options={options} ref={lineRef} width={400} height={400} title={'RGB diagram'} />
        </HistorgramContainer>

        <ButtonGrid>
          <span>Input</span>
          <Input type="number" />
          <Input type="number" />
          <span>Output</span>
          <Input type="number" />
          <Input type="number" />

        </ButtonGrid>
      </Modal>
    </>
  )
}