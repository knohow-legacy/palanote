import { fabric } from 'fabric'

export default async function loadFabricJSON(json: string) : Promise<string> {
    return new Promise(resolve => {
        let canvas = new fabric.Canvas(null);
        canvas.setDimensions({width: 1240, height: 1754});
        canvas.loadFromJSON(json, () => {
            resolve(canvas.toSVG());
            canvas.dispose();
        });
    })
    
}