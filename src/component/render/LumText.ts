
export default class LumText {
    private textElement: D3TextElement;
    private x: number;
    private y: number;
    private text: string;

    private containerWidth = 0;
    private containerHeight = 0;

    public constructor(x: number, y: number, text: string, textElement: D3TextElement) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.textElement = textElement;
    }

    public setContainerSize(width: number, height: number) {
        this.containerWidth = width;
        this.containerHeight = height;
    }

    public remove() {
        this.textElement.remove();
    }

    public append(text: string): D3TextSpanElement {
        return this.textElement.append('tspan')
            .attr('x', this.x)
            .attr('dy', '1em')
            .text(text);
    }
}