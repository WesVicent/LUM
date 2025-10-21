// import LumCard from "../../entities/LumCard";
// import LumText from "../../entities/LumText";
// import ResizingControll from "../../controllers/ResizingControll";
import RenderContext from "./RenderContext";

export default class RenderService {
    public readonly context: RenderContext;

    public constructor(context: RenderContext) {
        this.context = context;
    }

    /////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////  PRIMITIVES  ///////////////////////////////      
    public createPrimitiveGroup(x: number, y: number, width: number, height: number): D3GElement {
        return this.context.append('g')
        .attr("transform", `translate(${x}, ${y})`)
        .attr('width', width)       // Maybe doesn't matter
        .attr('height', height);    // Maybe doesn't matter
    }

    public drawPrimitiveRect(x: number, y: number, width: number, height: number, group?: D3GElement): D3RectElement {
        const node = group ?? this.context.getCore();

        const rect = node
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#ffffff')
            .attr('stroke', '#3d3d3dff')
            .attr('stroke-width', 1);

        return rect;
    }

    public drawPrimitiveLine(x: number, y: number, width: number, group?: D3GElement): D3LineElement {
        const node = group ?? this.context.getCore();

        const line = node.append('line')
            .attr('x1', x)
            .attr('y1', y)
            .attr('x2', width + x)
            .attr('y2', y)
            .style("stroke", "#3d3d3dff")
            .style("stroke-width", 1);

        return line;
    }

    public drawPrimitiveText(x: number, y: number, fontSize: number, text: string, group?: D3GElement): D3TextElement {
        const node = group ?? this.context.getCore();

        const textElement = node.append('text')
            .attr('x', 0)
            .attr('y', y)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
            .attr('fill', '#3d3d3dff')
            .attr('font-family', 'sans-serif')
            .attr('font-size', fontSize);

        textElement.append('tspan')
            .attr('x', x)
            .attr('dy', '0.15em')
            .text(text);

        return textElement;
    }
    /////////////////////////////////////////////////////////////////////////////////////

    public select(selection: string): D3BaseTypeSelection {
        return this.context.getCore().select(selection);
    }
}