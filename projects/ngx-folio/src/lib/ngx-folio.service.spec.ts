import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NgxFolioService } from './ngx-folio.service';

describe('NgxFolioService', () => {
  let spectator: SpectatorService<NgxFolioService>;
  const createService = createServiceFactory(NgxFolioService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
