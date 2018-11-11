export function updateConvasSize(canvas: HTMLCanvasElement, widthPx: number, heightPx: number): number {
    const r = window.devicePixelRatio || 1;
    canvas.height = heightPx * r;
    canvas.width = widthPx * r;
    canvas.style.width = widthPx + 'px';
    canvas.style.height = heightPx + 'px';
    return r;
}
