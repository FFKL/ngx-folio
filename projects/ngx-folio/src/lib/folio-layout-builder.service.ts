import { Injectable } from '@angular/core';
import { ELLIPSIS_MARKER } from './constants';
import { PagesLayout } from './types';
import { assert, first, last } from './util';

export interface FolioLayoutBuilderOptions {
  pagesAmount: number;
  currentPage: number;
  segmentsSizes: SegmentsSizes;
}

export interface SegmentsSizes {
  start: number;
  cursor: number;
  end: number;
}

class BuildTask {
  constructor(
    private readonly currentPage: number,
    private readonly pagesAmount: number,
    private readonly segmentsSizes: Readonly<SegmentsSizes>
  ) {}

  build(): PagesLayout {
    const lastPage = this.pagesAmount;
    const paginationLength = this.segmentsSizes.start + this.segmentsSizes.end + this.segmentsSizes.cursor;
    if (paginationLength >= this.pagesAmount) {
      return this.createPagesRange(1, lastPage);
    }
    const oneHiddenPage = this.pagesAmount - paginationLength === 1;

    const startSegment = this.createPagesRange(1, this.segmentsSizes.start);
    const leftEndBoundary = lastPage - this.segmentsSizes.end + 1;
    const endSegment = this.createPagesRange(leftEndBoundary, lastPage);
    const fullCursorSegment = this.createPagesRange(this.segmentsSizes.start + 1, leftEndBoundary - 1);
    const cursorSegment = this.createCursorSegment(fullCursorSegment, oneHiddenPage);

    const result: PagesLayout = [];
    result.push(...startSegment);
    if (!this.isCoupled(result, cursorSegment)) {
      result.push(ELLIPSIS_MARKER);
    }
    result.push(...cursorSegment);
    if (!this.isCoupled(result, endSegment)) {
      result.push(ELLIPSIS_MARKER);
    }
    result.push(...endSegment);

    return result;
  }

  private isCoupled(layout: PagesLayout, segment: number[]): boolean {
    if (!layout.length || !segment.length) {
      return false;
    }
    const lastLayoutItem = last(layout);
    const firstSegmentItem = first(segment);

    assert(lastLayoutItem !== undefined, 'Pages layout should have at least one element');
    assert(firstSegmentItem !== undefined, 'Segment should have at least one element');

    return lastLayoutItem === firstSegmentItem - 1;
  }

  private createCursorSegment(fullCursorSegment: number[], oneHiddenPage = false): number[] {
    const splitIdx = this.defineSplitIndex(fullCursorSegment, oneHiddenPage);
    const referencePage = fullCursorSegment[splitIdx];
    const beforeActive = fullCursorSegment.slice(0, splitIdx);
    const afterActive = fullCursorSegment.slice(splitIdx + 1, Infinity);

    return this.populateCursorSegment(referencePage, beforeActive, afterActive);
  }

  private defineSplitIndex(fullCursorSegment: number[], oneHiddenPage: boolean): number {
    const activePageIdx = fullCursorSegment.indexOf(this.currentPage);
    if (oneHiddenPage && activePageIdx === -1) {
      if (this.currentPage < fullCursorSegment[0]) {
        return 0;
      } else if (this.currentPage > fullCursorSegment[fullCursorSegment.length - 1]) {
        return fullCursorSegment.length - 1;
      }
    }
    const round = this.segmentsSizes.cursor % 2 ? Math.floor : Math.ceil;

    return activePageIdx === -1 ? round((fullCursorSegment.length - 1) / 2) : activePageIdx;
  }

  private populateCursorSegment(referencePage: number, before: number[], after: number[]): number[] {
    const result = [referencePage];

    let i = result.length;
    while ((before.length || after.length) && i < this.segmentsSizes.cursor) {
      if (before.length) {
        result.unshift(before.pop() as number);
        i += 1;
      }
      if (i < this.segmentsSizes.cursor && after.length) {
        result.push(after.shift() as number);
        i += 1;
      }
    }

    return result;
  }

  private createPagesRange(from: number, to: number): number[] {
    const segment = [];
    for (let i = from; i <= to; i += 1) {
      if (i > 0) {
        segment.push(i);
      }
    }

    return segment;
  }
}

@Injectable({ providedIn: 'root' })
export class FolioLayoutBuilderService {
  createLayout({ currentPage, pagesAmount, segmentsSizes }: FolioLayoutBuilderOptions): PagesLayout {
    const task = new BuildTask(currentPage, pagesAmount, segmentsSizes);

    return task.build();
  }
}
