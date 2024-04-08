import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Button, Input, Switch } from 'antd';
import { addImageToCanvas } from "../../model";
import { SwitchClickEventHandler } from "antd/es/switch";
import { FileContainer } from "./styles";
import { isValidUrl } from "../../../../shared/lib/url";

import { loadImageToCanvasByUrl } from '../../../renderer/model'
import { useAppDispatch, useAppSelector } from "../../../../app/store";

export const FileUploader: React.FC = () => {
  const dispatch = useAppDispatch();

  const isImageLoad = useAppSelector(state => state.canvasSlice.isLoadingImage)
  const isLastLoadImageFailed = useAppSelector(state => state.canvasSlice.isLastLoadImageFailed)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'FILE' | 'URL'>('FILE')
  const [imageUrl, setImageUrl] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      throw new Error('No file was provided')
    }

    dispatch(addImageToCanvas(file))
  }

  const onModeChange: SwitchClickEventHandler = (enabled) => {
    if (enabled) {
      setMode('FILE')
    } else {
      setMode('URL')
    }
  }

  /**
   * https://api.slingacademy.com/public/sample-photos/1.jpeg
   * 
   */
  const onImageLoad = (value: string) => {
    if (!isValid) return;
    dispatch(loadImageToCanvasByUrl(value))
  }

  const onImageUrlChange: React.FormEventHandler<HTMLInputElement> = (event) => {
    setImageUrl(event.currentTarget.value)
  }

  useEffect(() => {
    if (!imageUrl) {
      setIsValid(null)
      return;
    }
    setIsValid(isValidUrl(imageUrl))
  }, [imageUrl])

  useEffect(() => {
    if (isLastLoadImageFailed) {
      setIsValid(false)
    }
  }, [isLastLoadImageFailed])


  return (
    <FileContainer>
      <Switch value={mode === 'FILE'} checkedChildren={"file"} unCheckedChildren={"url"} onClick={onModeChange} />

      {mode === 'FILE' && (
        <>
          <input
            type="file"
            onChange={onFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/png, image/jpeg"
          />
          <Button onClick={onButtonClick}>Upload file</Button>
        </>
      )}

      {mode === 'URL' && (
        <div style={{ width: 300, display: 'inline-block' }}>
          <Input.Search
            enterButton
            onSearch={onImageLoad}
            onChange={onImageUrlChange}
            value={imageUrl}
            status={isValid !== false ? undefined : 'error'}
            loading={isImageLoad}
          />
        </div>
      )}
    </FileContainer>
  )
}