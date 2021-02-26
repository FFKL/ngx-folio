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

  it('should build layout with one hidden page', () => {
    const options: FolioLayoutBuilderOptions = {
      currentPage: 1,
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
