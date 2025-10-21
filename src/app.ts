import * as d3 from 'd3';
import RenderService from './core/render/engines/d3/RenderService'
import RenderContext from './core/render/engines/d3/RenderContext';
import { EventBus } from './core/render/EventBus';
import LumCard from './core/render/entities/LumCard';
import ResizingController from './core/render/controllers/ResizingController';
import MovingController from './core/render/controllers/MovingController';
import ResizeNode from './core/render/entities/working-bench/ResizeNode';

class Lum {
    public static init() {
        const SVG_ID = 'diagram';
        const svg: D3SVGElement = d3.select(`#${SVG_ID}`);
        const element = document.getElementById(SVG_ID);

        const contextWidth = element?.clientWidth || 100;
        const contextHeight = element?.clientHeight || 100;

        const eventBus = new EventBus();
        const renderContext = new RenderContext(svg, contextWidth, contextHeight);
        const renderService: RenderService = new RenderService(renderContext);

        const WIDHT = 200;
        const HEIGHT = WIDHT / 2;

        const X_POS = renderContext.hCenter - WIDHT / 2;
        const Y_POS = renderContext.vCenter - HEIGHT / 2;

        new MovingController(eventBus);

        const entities = [
            new LumCard('card-', X_POS, Y_POS, WIDHT, HEIGHT, renderService, eventBus),
            new ResizeNode('resizing-nodes', X_POS, Y_POS, WIDHT, HEIGHT, renderService, eventBus),
        ];



        entities.forEach(entity => {
            // entity.draw();
        });
    }
}

// When the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Lum.init();
});