import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'icon-loading',
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <circle cx="4" cy="12" r="3" fill="currentColor">
      <animate
        id="svgSpinners3DotsBounce0"
        attributeName="cy"
        begin="0;svgSpinners3DotsBounce1.end+0.375s"
        calcMode="spline"
        dur="0.9s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
    <circle cx="12" cy="12" r="3" fill="currentColor">
      <animate
        attributeName="cy"
        begin="svgSpinners3DotsBounce0.begin+0.15s"
        calcMode="spline"
        dur="0.9s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
    <circle cx="20" cy="12" r="3" fill="currentColor">
      <animate
        id="svgSpinners3DotsBounce1"
        attributeName="cy"
        begin="svgSpinners3DotsBounce0.begin+0.3s"
        calcMode="spline"
        dur="0.9s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
  </svg>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconLoadingComponent {}
