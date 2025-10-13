import * as d3 from 'd3';
import RenderService from './services/render/RenderService'
import RenderContext from './services/render/RenderContext';

class App {
    public static init() {
        const SVG_ID = 'diagram';
        const svg: D3SVGElement = d3.select(`#${SVG_ID}`);
        const element = document.getElementById(SVG_ID);

        const contextWidth = element?.clientWidth || 100;
        const contextHeight = element?.clientHeight || 100;

        const renderContext = new RenderContext(svg, contextWidth, contextHeight);
        const renderService: RenderService = new RenderService(renderContext);

        const WIDHT = 350;
        const HEIGHT = WIDHT / 2;

        const X_POS = renderContext.hCenter - WIDHT / 2;
        const Y_POS = renderContext.vCenter - HEIGHT / 2;
 
        renderService.drawCard(X_POS, Y_POS, WIDHT, HEIGHT);

        const text = renderService.drawText(X_POS, Y_POS, '123456789-12345678');
        text.append('123456789-12345678');
        text.append('123456789-12345678');
        text.append('123456789-12345678');
        text.append('123456789-12345678');
    }
}

// When the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});