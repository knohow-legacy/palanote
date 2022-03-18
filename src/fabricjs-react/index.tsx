import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useFabricJSEditor, FabricJSEditor, FabricJSEditorHook } from './editor'

export interface Props {
  className?: string,
  dimensions: {width: number, height: number},
  onReady?: (canvas: fabric.Canvas) => void
}

/**
 * Fabric canvas as component, modified for PostIt.
 */
const FabricJSCanvas = ({ className, dimensions, onReady }: Props) => {
  const canvasEl = useRef(null)
  const canvasElParent = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {width: dimensions.width, height: dimensions.height})
    const setCurrentDimensions = () => {
      // The reason this wasn't just installed from NPM is because I needed to modify
      // the dimension scaling code to fit our purposes.
      canvas._objects.forEach((obj:any) => {
        obj.scaleX /= (canvas.getWidth() / (canvasElParent.current?.clientWidth || 1))
        obj.scaleY /= (canvas.getWidth() / (canvasElParent.current?.clientWidth || 1))
        obj.left /= (canvas.getWidth() / (canvasElParent.current?.clientWidth || 1))
        obj.top /= (canvas.getWidth() / (canvasElParent.current?.clientWidth || 1))
        obj.setCoords();
      })

      canvas.setHeight(canvas.getHeight() / (canvas.getWidth() / (canvasElParent.current?.clientWidth || 1)))
      canvas.setWidth(canvasElParent.current?.clientWidth || 0)
      canvas.renderAll()
    }
    const resizeCanvas = () => {
      setCurrentDimensions()
    }
    setCurrentDimensions()

    window.addEventListener('resize', resizeCanvas, false)

    if (onReady) {
      onReady(canvas)
    }

    return () => {
      canvas.dispose()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  )
}

export type { FabricJSEditor, FabricJSEditorHook }
export { FabricJSCanvas, useFabricJSEditor }