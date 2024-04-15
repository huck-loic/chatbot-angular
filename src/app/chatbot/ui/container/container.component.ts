import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'container',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        max-width: 900px;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {}
