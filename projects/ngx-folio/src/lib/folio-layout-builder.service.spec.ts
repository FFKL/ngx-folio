import { FolioLayoutBuilderOptions, FolioLayoutBuilderService } from './folio-layout-builder.service';

describe('FolioLayoutBuilderService', () => {
  describe('when the sum of segments is less then or equal to maxPage', () => {
    it('should build layout without cursor segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 4,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4]);
    });

    it('should build layout with cursor segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 7,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('when the sum of segments is more by one than maxPage', () => {
    it('should build layout with coupled start and end segments when currentPage is inside start segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 8,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, '...', 7, 8]);
    });

    it('should build layout with coupled cursor and end segments when currentPage is inside end segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 8,
        maxPage: 8,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, 7, 8]);
    });
  });

  describe('when difference between maxPage and the sum of segments is more than one', () => {
    it('should build layout with ellipsis between segments', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 9,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, '...', 8, 9]);
    });

    it('should build coupled start and cursor segments when current page is right after start segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 3,
        maxPage: 9,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, '...', 8, 9]);
    });

    it('should build cupled end and cursor segments when current page is just before end segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 7,
        maxPage: 9,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, 7, 8, 9]);
    });

    it('should build cursor segment in the middle when maxPage is even and cursorSegment is odd', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 10,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, '...', 9, 10]);
    });

    it('should build cursor segment in the middle when maxPage is odd and cursorSegment is odd', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 11,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 3,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, 7, '...', 10, 11]);
    });

    it('should build cursor segment in the middle when maxPage is odd and cursorSegment is even', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 11,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 2,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, '...', 10, 11]);
    });

    it('should build cursor segment in the middle when maxPage is even and cursorSegment is even', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        maxPage: 10,
        startSegmentMax: 2,
        endSegmentMax: 2,
        cursorSegmentMax: 2,
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, '...', 9, 10]);
    });
  });
});
