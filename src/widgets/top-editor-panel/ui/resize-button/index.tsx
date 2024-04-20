import React, { useState } from "react";
import { Modal, Button, InputNumber, Select, Checkbox } from 'antd'
import { Container, DimensionInputContainer } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Dimension, useDimensionValue } from "../../hooks/use-dimension-value";
import { resizeImages } from "../../../../entities/renderer";

export const ResizeButton: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [dimension, setDimension] = useState<Dimension>('PERCENT');
  const imagesSize = useAppSelector(state => state.canvasSlice.imagesSize);


  const { value: width,
    setValue: setWidth,
    valueInPercent: widthInPercent,
  } = useDimensionValue(dimension, imagesSize.width ?? 100)
  const {
    value: height,
    setValue: setHeight,
    valueInPercent: heightInPercent,
  } = useDimensionValue(dimension, imagesSize.height ?? 100)

  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  }

  const handleModalCancel = () => {
    setIsModalOpen(false);
  }

  const handleDimensionChange = (value: Dimension) => {
    setDimension(value)
    console.log('setDimension')
  }

  const handleSyncChange = (event: CheckboxChangeEvent) => {
    setIsSync(event.target.checked);
  }

  const createDimensionChanger = (dimensionSetter: (value: number) => void) => (val: number | null) => {
    dimensionSetter(val ?? 0)
  }

  const handleResizeButton = () => {
    console.log('widthInPercent', widthInPercent);
    console.log('heightInPercent', heightInPercent)
    dispatch(resizeImages({
      scaleX: widthInPercent / 100,
      scaleY: heightInPercent / 100,
    }))

    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={handleButtonClick} disabled={isCanvasEmpty}>Resize</Button>
      <Modal title="Resize canvas" open={isModalOpen} onCancel={handleModalCancel} onOk={handleResizeButton}>
        <Container>
          <DimensionInputContainer>
            <span>Dimension in </span>
            <Select
              options={[{ value: 'PERCENT', label: 'percent' }, { value: 'PIXEL', label: 'pixel' }]}
              value={dimension}
              onChange={handleDimensionChange}
            />
          </DimensionInputContainer>
          <DimensionInputContainer>
            <span>Sync proportion </span>
            <div className="">
              <Checkbox value={isSync} onChange={handleSyncChange} />
            </div>
          </DimensionInputContainer>
          <DimensionInputContainer>
            <span>Width:</span>
            <InputNumber value={width} onChange={createDimensionChanger(setWidth)} />
          </DimensionInputContainer>
          <DimensionInputContainer>
            <span>Height:</span>
            <InputNumber value={height} onChange={createDimensionChanger(setHeight)} />
          </DimensionInputContainer>
          <DimensionInputContainer>
            <span>Algorithm</span>
            <Select options={[{ value: 'neighbour', label: 'nearest neighbour' }]} value={"neighbour"} />
          </DimensionInputContainer>
        </Container>
      </Modal>
    </>
  )
}