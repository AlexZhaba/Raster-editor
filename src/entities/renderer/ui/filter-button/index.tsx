import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { ChangeEvent, useEffect, useState } from "react";
import { BaseCoef, CernelTitle, MatrixContainer } from "./styles";
import { MATRIX_PRESET_MAP } from "./constants";
import { Preview } from "../curve-button/preview";
import { PreviewEmpty } from "../curve-button/styles";
import { getFilteredImageData } from "../../../../shared/lib";
import { updateCanvasByFilter } from "../../model";

export const FilterButton = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const renderer = useAppSelector((state) => state.canvasSlice.renderer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matrix, setMatrix] = useState([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const [matrixPreset, setMatrixPreset] = useState("default");
  const [baseMatrixCoef, setBaseMatrixCoef] = useState(1);
  const [previewData, setPreviewData] = useState<ImageData>();

  const handleMatrixChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setMatrix((prev) => {
        const newMatrix = [...prev];
        newMatrix[index] = Number(value);
        return newMatrix;
      });
    };

  const handleMatrixPresetChange = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setMatrixPreset(value);
    setMatrix(MATRIX_PRESET_MAP[value].matrix);
    setBaseMatrixCoef(MATRIX_PRESET_MAP[value].baseCoef);
  };

  const updatePrewiewData = async (kernel: number[], coef: number) => {
    const result = await renderer?.getDrawable(0)?.getData();
    if (!result) return;

    const data = getFilteredImageData(
      result.data,
      result.width,
      result.height,
      kernel,
      coef
    );
    console.log("yes");
    const imageData = new ImageData(result.width, result.height);
    imageData.data.set(data);
    setPreviewData(imageData);
  };

  const handleResetButton = () => {
    setMatrixPreset("default");
    setMatrix(MATRIX_PRESET_MAP["default"].matrix);
    setBaseMatrixCoef(MATRIX_PRESET_MAP["default"].baseCoef);
  };

  const handleOkButton = () => {
    dispatch(
      updateCanvasByFilter({
        kernel: matrix,
        kernelBaseCoef: baseMatrixCoef,
      })
    );
    setIsModalOpen(false);
  };

  useEffect(() => {
    updatePrewiewData(matrix, baseMatrixCoef);
  }, [matrix, isModalOpen, baseMatrixCoef]);

  return (
    <>
      <Button
        disabled={isCanvasEmpty}
        onClick={() => setIsModalOpen(true)}
        type="primary"
      >
        Filter
      </Button>
      <Modal
        title="Image filtering"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOkButton}
        width={700}
      >
        <Flex justify="center" gap={20}>
          <div>
            <MatrixContainer>
              {Array(9)
                .fill(0)
                .map((_, i) => (
                  <Input
                    key={i}
                    value={matrix[i]}
                    onChange={handleMatrixChange(i)}
                  />
                ))}
            </MatrixContainer>
            <BaseCoef>
              <span>Base kernel coef</span>
              <Input
                title="Base coef"
                value={baseMatrixCoef}
                type="number"
                onChange={(event) =>
                  setBaseMatrixCoef(Number(event.currentTarget.value))
                }
              />
            </BaseCoef>
            <Flex gap={16} vertical={true} align="flex-start">
              <CernelTitle>
                <span>Cernel preset:</span>
              </CernelTitle>
              <Radio.Group
                value={matrixPreset}
                onChange={handleMatrixPresetChange}
              >
                <Space direction="vertical">
                  <Radio value="default">Default</Radio>
                  <Radio value="sharp">Sharpening</Radio>
                  <Radio value="gause">Gaussian filter</Radio>
                  <Radio value="blur">Rectangular blur</Radio>
                </Space>
              </Radio.Group>
              <Flex align="center" gap={16}>
                <Button onClick={handleResetButton}>Reset</Button>
                <Checkbox
                  value={isPreviewOpen}
                  onChange={(event) => setIsPreviewOpen(event.target.checked)}
                >
                  Show preview
                </Checkbox>
              </Flex>
            </Flex>
          </div>
          {isPreviewOpen && previewData ? (
            <Preview drawableData={previewData} />
          ) : (
            <div style={{ width: 400, height: 400, paddingBottom: 20 }}>
              <PreviewEmpty>
                <span>Press "Show preview" to look result</span>
              </PreviewEmpty>
            </div>
          )}
        </Flex>
      </Modal>
    </>
  );
};
