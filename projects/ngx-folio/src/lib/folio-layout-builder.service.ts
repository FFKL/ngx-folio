import { Injectable } from '@angular/core';
import { ELLIPSIS_MARKER } from './constants';
import { PagesLayout } from './types';
import { assert, first, last } from './util';

export interface FolioLayoutBuilderOptions {
  maxPage: number;
  startSegmentMax: number;
  endSegmentMax: number;
  cursorSegmentMax: number;
  currentPage: number;
}

@Injectable({ providedIn: 'root' })
export class FolioLayoutBuilderService {
  createLayout({
    maxPage,
    startSegmentMax,
    endSegmentMax,
    currentPage,
    cursorSegmentMax,
  }: FolioLayoutBuilderOptions): PagesLayout {
    const lastPage = maxPage;
    const paginationLength = startSegmentMax + endSegmentMax + cursorSegmentMax;
    if (paginationLength >= maxPage) {
      return this.createPagesRange(1, lastPage);
    }

    const startSegment = this.createPagesRange(1, startSegmentMax);
    const leftEndBoundary = lastPage - endSegmentMax + 1;
    const endSegment = this.createPagesRange(leftEndBoundary, lastPage);
    const fullCursorSegment = this.createPagesRange(startSegmentMax + 1, leftEndBoundary - 1);
    const cursorSegment = this.createCursorSegment(fullCursorSegment, currentPage, cursorSegmentMax);

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

  private createCursorSegment(fullCursorSegment: number[], currentPage: number, cursorSegmentMax: number): number[] {
    const activePageIdx = fullCursorSegment.indexOf(currentPage);
    const splitIdx = activePageIdx === -1 ? Math.ceil((fullCursorSegment.length - 1) / 2) : activePageIdx;
    const referencePage = fullCursorSegment[splitIdx];
    const beforeActive = fullCursorSegment.slice(0, splitIdx);
    const afterActive = fullCursorSegment.slice(splitIdx + 1, Infinity);

    return this.populateCursorSegment(referencePage, beforeActive, afterActive, cursorSegmentMax);
  }

  private populateCursorSegment(
    referencePage: number,
    before: number[],
    after: number[],
    cursorSegmentMax: number
  ): number[] {
    const result = [referencePage];

    let i = result.length;
    while ((before.length || after.length) && i < cursorSegmentMax) {
      if (before.length) {
        result.unshift(before.pop() as number);
        i += 1;
      }
      if (i < cursorSegmentMax && after.length) {
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
