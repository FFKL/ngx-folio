import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgxFolioComponent } from './ngx-folio.component';
import { ValidationError } from './util';

describe('NgxFolioComponent', () => {
  let spectator: Spectator<NgxFolioComponent>;
  const createComponent = createComponentFactory(NgxFolioComponent);

  beforeEach(() => (spectator = createComponent()));

  describe('Inputs validation', () => {
    it('should throw validation error for negative page number', () => {
      const setInput = spectator.setInput.bind(spectator, 'page', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for zero page number', () => {
      const setInput = spectator.setInput.bind(spectator, 'page', 0);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float page number', () => {
      const setInput = spectator.setInput.bind(spectator, 'page', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for negative pageSize number', () => {
      const setInput = spectator.setInput.bind(spectator, 'pageSize', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for zero pageSize number', () => {
      const setInput = spectator.setInput.bind(spectator, 'pageSize', 0);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float pageSize number', () => {
      const setInput = spectator.setInput.bind(spectator, 'pageSize', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for negative collectionSize number', () => {
      const setInput = spectator.setInput.bind(spectator, 'collectionSize', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float collectionSize number', () => {
      const setInput = spectator.setInput.bind(spectator, 'collectionSize', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for negative cursorSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'cursorSegmentMax', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for zero cursorSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'cursorSegmentMax', 0);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float cursorSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'cursorSegmentMax', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for negative startSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'startSegmentMax', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for zero startSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'startSegmentMax', 0);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float startSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'startSegmentMax', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for negative endSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'endSegmentMax', -1);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for zero endSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'endSegmentMax', 0);

      expect(setInput).toThrowError(ValidationError);
    });

    it('should throw validation error for float endSegmentMax number', () => {
      const setInput = spectator.setInput.bind(spectator, 'endSegmentMax', 1.3);

      expect(setInput).toThrowError(ValidationError);
    });
  });
});
