import { FolioLayoutBuilderOptions, FolioLayoutBuilderService } from './folio-layout-builder.service';

describe('FolioLayoutBuilderService', () => {
  describe('when the sum of segments is less then or equal to pagesAmount', () => {
    it('should build layout without cursor segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 4,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4]);
    });

    it('should build layout with cursor segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 7,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('when the sum of segments is more by one than pagesAmount', () => {
    it('should build layout with coupled start and end segments when currentPage is inside start segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 8,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, '...', 7, 8]);
    });

    it('should build layout with coupled cursor and end segments when currentPage is inside end segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 8,
        pagesAmount: 8,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, 7, 8]);
    });
  });

  describe('when difference between pagesAmount and the sum of segments is more than one', () => {
    it('should build layout with ellipsis between segments', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 9,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, '...', 8, 9]);
    });

    it('should build coupled start and cursor segments when current page is right after start segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 3,
        pagesAmount: 9,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, 3, 4, 5, '...', 8, 9]);
    });

    it('should build cupled end and cursor segments when current page is just before end segment', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 7,
        pagesAmount: 9,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, 7, 8, 9]);
    });

    it('should build cursor segment in the middle when pagesAmount is even and cursor size is odd', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 10,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 4, 5, 6, '...', 9, 10]);
    });

    it('should build cursor segment in the middle when pagesAmount is odd and cursor size is odd', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 11,
        segmentsSizes: { start: 2, end: 2, cursor: 3 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, 7, '...', 10, 11]);
    });

    it('should build cursor segment in the middle when pagesAmount is odd and cursor size is even', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 11,
        segmentsSizes: { start: 2, end: 2, cursor: 2 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, '...', 10, 11]);
    });

    it('should build cursor segment in the middle when pagesAmount is even and cursor size is even', () => {
      const options: FolioLayoutBuilderOptions = {
        currentPage: 1,
        pagesAmount: 10,
        segmentsSizes: { start: 2, end: 2, cursor: 2 },
      };
      const builder = new FolioLayoutBuilderService();

      const layout = builder.createLayout(options);

      expect(layout).toEqual([1, 2, '...', 5, 6, '...', 9, 10]);
    });
  });
});
