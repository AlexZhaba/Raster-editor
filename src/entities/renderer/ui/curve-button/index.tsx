import { Button, Modal } from "antd"
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { useEffect, useMemo, useState } from "react";
import { Chart, ChartDataset, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { getRgbStatisticByDrawable } from "../../model";

Chart.register(...registerables);

export const CurveButton = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty);
  const rgbData = useAppSelector(state => state.canvasSlice.rgbStat)

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
      label: 'R',
      data: rgbData.r,
      backgroundColor: 'red',
    },
    {
      label: 'g',
      data: rgbData.g,
      backgroundColor: 'green'
    },
    {
      label: 'b',
      data: rgbData.b,
      backgroundColor: 'blue'
    },
  ], [rgbData])

  const data = {
    labels: new Array(256).fill(0).map((_, i) => i),
    datasets: histogramDatasets,
  };


  return (
    <>
      <Button type="primary" disabled={isCanvasEmpty} onClick={handleButtonClick}>
        Curve
      </Button>
      <Modal open={isModalOpen} onCancel={handleModalCancel}>
        Roflan modal
        <Line data={data} />

      </Modal>
    </>
  )
}