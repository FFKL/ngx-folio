import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgxFolioComponent } from './ngx-folio.component';

describe('NgxFolioComponent', () => {
  let spectator: Spectator<NgxFolioComponent>;
  const createComponent = createComponentFactory(NgxFolioComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
