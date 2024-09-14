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
import { useAppSelector } from "../../../../app/store";
import { ChangeEvent, useState } from "react";
import { CernelTitle, MatrixContainer } from "./styles";
import { MATRIX_PRESET_MAP } from "./constants";
import { Preview } from "../curve-button/preview";
import { PreviewEmpty } from "../curve-button/styles";

export const FilterButton = () => {
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matrix, setMatrix] = useState([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const [matrixPreset, setMatrixPreset] = useState("default");

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
    setMatrix(MATRIX_PRESET_MAP[value]);
  };

  const handleResetButton = () => {
    setMatrixPreset("default");
    setMatrix(MATRIX_PRESET_MAP["default"]);
  };

  return (
    <>
      <Button
        disabled={false}
        onClick={() => setIsModalOpen(true)}
        type="primary"
      >
        Filter
      </Button>
      <Modal
        title="Image filtering"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
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
          <div style={{ width: 400, height: 400, paddingBottom: 20 }}>
            <PreviewEmpty>
              <span>Press "Show preview" to look result</span>
            </PreviewEmpty>
          </div>
        </Flex>
      </Modal>
    </>
  );
};
