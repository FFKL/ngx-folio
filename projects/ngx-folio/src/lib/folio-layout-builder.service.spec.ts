import { FolioLayoutBuilderOptions, FolioLayoutBuilderService } from './folio-layout-builder.service';

describe('FolioLayoutBuilderService', () => {
  it('should build layout without cursor segment and hidden pages', () => {
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

  it('should build layout without hidden pages for maxPage equals to sum of segments', () => {
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

  it('should build layout with one hidden page and cursor segment joined to start segment when current page is in first segment', () => {
    const options: FolioLayoutBuilderOptions = {
      currentPage: 1,
      maxPage: 8,
      startSegmentMax: 2,
      endSegmentMax: 2,
      cursorSegmentMax: 3,
    };
    const builder = new FolioLayoutBuilderService();

    const layout = builder.createLayout(options);

    // TODO: rework to [1, 2, 3, 4, 5, '...', 7, 8]
    expect(layout).toEqual([1, 2, '...', 4, 5, 6, 7, 8]);
  });

  it('should build layout with one hidden page and cursor segment joined to end segment when current page is in end segment', () => {
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

  it('should build layout with two hidden pages', () => {
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

  it('should join start and cursor segments when current page is right after start segment', () => {
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

  it('should join end and cursor segments when current page is just before end segment', () => {
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

  it('should build cursor segment right in the middle for even number of max page and odd number of cursor segment', () => {
    const options: FolioLayoutBuilderOptions = {
      currentPage: 1,
      maxPage: 10,
      startSegmentMax: 2,
      endSegmentMax: 2,
      cursorSegmentMax: 3,
    };
    const builder = new FolioLayoutBuilderService();

    const layout = builder.createLayout(options);

    // TODO: rework to [1, 2, '...', 4, 5, 6, '...', 9, 10]
    expect(layout).toEqual([1, 2, '...', 5, 6, 7, '...', 9, 10]);
  });

  it('should build cursor segment right in the middle for odd number of max page and odd number of cursor segment', () => {
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

  it('should build cursor segment right in the middle for odd number of max page and even number of cursor segment', () => {
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

  it('should build cursor segment right in the middle for even number of max page and even number of cursor segment', () => {
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
