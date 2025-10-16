import * as d3 from "d3";
import RenderService from "../../services/render/RenderService";
import LumText from "./LumText";

export default class LumCard {
    private localGroup: D3GElement;
    private rect: D3RectElement;
    private line: D3LineElement;
    private text: LumText;

    constructor(x: number, y: number, areaWidth: number, areaHeight: number, renderService: RenderService) {
        this.localGroup = renderService.createPrimitiveGroup(x, y, areaWidth, areaHeight);
        let stringText = '123456789-12345678';

        const rect = renderService.drawPrimitiveRect(0, 0, areaWidth, areaHeight, this.localGroup);
        const line = renderService.drawPrimitiveLine(0, 0 + areaHeight / 5, areaWidth, this.localGroup);
        const text = renderService.drawText(0, 0, areaWidth, areaHeight, 18, `${stringText}${stringText}${stringText}${stringText}${stringText}`, this.localGroup);

        this.rect = rect;
        this.line = line;
        this.text = text;

        const dragHandler = d3.drag<SVGGElement, unknown, d3.SubjectPosition>()
            .on('start', function (event: d3.D3DragEvent<SVGGElement, unknown, d3.SubjectPosition>) {
                x += event.x;
                y += event.y;
                
                d3.select(this).attr("transform", `translate(${x}, ${y})`);

                rect.attr('stroke-width', "2")
                    .attr('stroke', "#096bc7ff");

                line.style("stroke-width", 2)
                    .style("stroke", "#096bc7ff");

            })
            .on('drag', function (event: d3.D3DragEvent<SVGGElement, unknown, d3.SubjectPosition>) {
                x += event.x;
                y += event.y;
                
                d3.select(this).attr("transform", `translate(${x}, ${y})`);

                rect.attr('stroke-width', "2")
                    .attr('stroke', "#096bc7ff");

                line.style("stroke-width", 2)
                    .style("stroke", "#096bc7ff");
            })
            .on('end', function (event: d3.D3DragEvent<SVGGElement, unknown, d3.SubjectPosition>) {
                x += event.x;
                y += event.y;
                
                d3.select(this).attr("transform", `translate(${x}, ${y})`);
                rect.attr('stroke-width', "1")
                    .attr('stroke', "#3d3d3dff");

                    line.style("stroke-width", 1)
                    .style("stroke", "#3d3d3dff");
            });

        this.localGroup.call(dragHandler);
    }

    public remove() {
        this.line.remove();
        this.rect.remove();
    }

    public call(selection: D3DragGroupFunction): void {
        this.localGroup.call(selection);
    }
}
