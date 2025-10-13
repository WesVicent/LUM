
export default class LumCard {
    private rect: D3RectElement;
    private line: D3LineElement;

    constructor(rect: D3RectElement, line: D3LineElement) {
        this.line = line;
        this.rect = rect;
    }

    public remove() {
        this.line.remove();
        this.rect.remove();
    }
}