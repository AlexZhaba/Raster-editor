import React from "react"
import { RgbColor, convertToRgb } from "../../lib"

export const ColorPreview: React.FC<{ color: RgbColor | null }> = ({ color }) => {
  return (
    <div style={{ width: 20, height: 20, background: color ? convertToRgb(color) : 'white', border: '1px solid black' }}></div>
  )
}