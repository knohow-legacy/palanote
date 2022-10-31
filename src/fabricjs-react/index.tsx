import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useFabricJSEditor, FabricJSEditor, FabricJSEditorHook } from './editor'

export interface Props {
  className?: string,
  dimensions: {width: number, height: number},
  onReady?: (canvas: fabric.Canvas) => void
}

/**
 * Fabric canvas as component, modified for PalaNote.
 */
const FabricJSCanvas = ({ className, dimensions, onReady }: Props) => {
  const canvasEl = useRef(null)
  const canvasElParent = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {width: dimensions.width, height: dimensions.height, enablePointerEvents: true} as any)
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

    // @ts-ignore
    canvas.setCurrentDimensions = setCurrentDimensions;

    setCurrentDimensions();

    const resizeObserver = new ResizeObserver(() => {
      // Do what you want to do when the size of the element changes
      setCurrentDimensions();
    });
    resizeObserver.observe(canvasElParent.current as Element);

    (canvas as any)['setCurrentDimensions'] = setCurrentDimensions;

    if (onReady) {
      onReady(canvas)
    }

    return () => {
      canvas.dispose();
      resizeObserver.disconnect();
    }
  }, [])

  const preventDefault = (e:any) => {
    if (e.target.tagName === "CANVAS") e.preventDefault();
  }

  useEffect(() => {
    const states = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'touchenter', 'touchleave'];
    // On iPad, this fixes the text selection popup from appearing when you double tap.
    for (let i = 0; i < states.length; i++) {
      window.addEventListener(states[i], preventDefault, {passive: false})
    }

    return () => {
      for (let i = 0; i < states.length; i++) {
        window.removeEventListener(states[i], preventDefault)
      }
    }
  })

  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  )
}

export type { FabricJSEditor, FabricJSEditorHook }
export { FabricJSCanvas, useFabricJSEditor }