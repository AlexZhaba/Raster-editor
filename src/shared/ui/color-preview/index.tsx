import React, { useMemo } from "react"
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { RgbColor, convertRgbToLab, convertRgbToXYZ, convertToRgb } from "../../lib"
import { Container, PipetteMeta } from "./styles";

interface ColorPreviewProps {
  color: RgbColor | null | undefined;
  title?: string;
  showMeta?: boolean;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color, title, showMeta = true }) => {

  const xyzColor = useMemo(() => color ? convertRgbToXYZ(color) : null, [color]);
  const labColor = useMemo(() => color ? convertRgbToLab(color) : null, [color]);
  return (
    <Container>
      <div style={{ width: 20, height: 20, background: color ? convertToRgb(color) : 'white', border: '1px solid black' }}></div>
      {title && (
        <Tooltip title={title}>
          <QuestionCircleOutlined />
        </Tooltip>
      )}
      {color && xyzColor && labColor && showMeta && (
        <PipetteMeta>
          <span>rgb: {color[0]},{color[1]},{color[2]}</span>
          <span>xyz: {xyzColor[0]},{xyzColor[1]},{xyzColor[2]}</span>
          <span>lab: {labColor[0]},{labColor[1]},{labColor[2]}</span>
        </PipetteMeta>
      )}
    </Container>
  )
}