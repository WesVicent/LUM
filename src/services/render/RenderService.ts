import LumCard from "../../component/render/LumCard";
import LumText from "../../component/render/LumText";
import RenderContext from "./RenderContext";

export default class RenderService {
    private context: RenderContext;

    public constructor(context: RenderContext) {
        this.context = context;
    }

    /////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////  PRIMITIVES  ///////////////////////////////      
    public drawPrimitiveRect(x: number, y: number, width: number, height: number): D3RectElement {
        return this.context.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#ffffff')
            .attr('stroke', '#3d3d3dff')
            .attr('stroke-width', 1);
    }

    public drawPrimitiveLine(x: number, y: number, width: number): D3LineElement {
        return this.context.append('line')
            .attr('x1', x)
            .attr('y1', y)
            .attr('x2', width + x)
            .attr('y2', y)
            .style("stroke", "#555555")
            .style("stroke-width", 1);
    }

    public drawPrimitiveText(x: number, y: number, text: string): D3TextElement {
        const textElement = this.context.append('text')
            .attr('x', 0)
            .attr('y', y)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
            .attr('fill', '#3d3d3dff')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 35);

            textElement.append('tspan')
            .attr('x', x)
            .attr('dy', '0.15em')
            .text(text);

            return textElement;
    }
            //////////////////////////  PRIMITIVES  ///////////////////////////////      
    /////////////////////////////////////////////////////////////////////////////////////

    public drawCard(x: number, y: number, width: number, height: number): LumCard {
        return new LumCard(this.drawPrimitiveRect(x, y, width, height), this.drawPrimitiveLine(x, y + height / 5, width));
    } 
    
    public drawText(x: number, y: number, text: string): LumText {
        return new LumText(x, y, text, this.drawPrimitiveText(x, y, text));
    }
}