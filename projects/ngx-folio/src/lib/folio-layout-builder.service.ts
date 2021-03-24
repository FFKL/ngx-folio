import { Injectable } from '@angular/core';
import { SEGMENTS_DELIMITER } from './constants';
import { SegmentsDelimiter, PagesLayout } from './types';
import { assert, first, last, numbersRange } from './util';

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
    if (this.getHiddenPagesAmount() === 0) {
      return numbersRange(1, this.pagesAmount);
    }

    const startSegment = numbersRange(1, this.segmentsSizes.start);
    const leftEndBoundary = this.pagesAmount - this.segmentsSizes.end + 1;
    const endSegment = numbersRange(leftEndBoundary, this.pagesAmount);
    const fullCursorSegment = numbersRange(this.segmentsSizes.start + 1, leftEndBoundary - 1);
    const cursorSegment = this.createCursorSegment(fullCursorSegment);

    return this.glueSegments(startSegment, cursorSegment, endSegment);
  }

  private glueSegments(start: number[], cursor: number[], end: number[]): PagesLayout {
    return [
      ...start,
      ...this.delimiterSegment(start, cursor),
      ...cursor,
      ...this.delimiterSegment(cursor, end),
      ...end,
    ];
  }

  private delimiterSegment(a: number[], b: number[]): [SegmentsDelimiter] | [] {
    return this.isCoupled(a, b) ? [] : [SEGMENTS_DELIMITER];
  }

  private getVisiblePagesAmount(): number {
    return this.segmentsSizes.start + this.segmentsSizes.end + this.segmentsSizes.cursor;
  }

  private getHiddenPagesAmount(): number {
    const diff = this.pagesAmount - this.getVisiblePagesAmount();

    return diff >= 0 ? diff : 0;
  }

  private isCoupled(layout: number[], segment: number[]): boolean {
    if (!layout.length || !segment.length) {
      return false;
    }
    const lastLayoutItem = last(layout);
    const firstSegmentItem = first(segment);

    assert(lastLayoutItem !== undefined, 'Pages layout should have at least one element');
    assert(firstSegmentItem !== undefined, 'Segment should have at least one element');

    return lastLayoutItem === firstSegmentItem - 1;
  }

  private createCursorSegment(fullCursorSegment: number[]): number[] {
    const splitIdx = this.defineSplitIndex(fullCursorSegment);
    const referencePage = fullCursorSegment[splitIdx];
    const beforeActive = fullCursorSegment.slice(0, splitIdx);
    const afterActive = fullCursorSegment.slice(splitIdx + 1, Infinity);

    return this.populateCursorSegment(referencePage, beforeActive, afterActive);
  }

  private defineSplitIndex(fullCursorSegment: number[]): number {
    const activePageIdx = fullCursorSegment.indexOf(this.currentPage);
    if (this.getHiddenPagesAmount() === 1 && activePageIdx === -1) {
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
    const beforeCopy = [...before];
    const afterCopy = [...after];

    while ((beforeCopy.length || afterCopy.length) && result.length < this.segmentsSizes.cursor) {
      const lastItem = beforeCopy.pop();
      const firstItem = afterCopy.shift();
      if (lastItem) {
        result.unshift(lastItem);
      }
      if (result.length < this.segmentsSizes.cursor && firstItem) {
        result.push(firstItem);
      }
    }

    return result;
  }
}

@Injectable({ providedIn: 'root' })
export class FolioLayoutBuilderService {
  createLayout({ currentPage, pagesAmount, segmentsSizes }: FolioLayoutBuilderOptions): PagesLayout {
    const task = new BuildTask(currentPage, pagesAmount, segmentsSizes);

    return task.build();
  }
}
