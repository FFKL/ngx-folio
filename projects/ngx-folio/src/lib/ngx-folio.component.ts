import { ContentChild, Directive, SimpleChanges } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, EventEmitter, OnChanges } from '@angular/core';
import { last, first, assert, checkValidationErrors } from './util';
import { ValidatorService } from './validator.service';

type PagesLayout = (number | '...')[];

@Directive({ selector: '[button-prev]' })
export class ButtonPrevDirective {}

@Directive({ selector: '[button-next]' })
export class ButtonNextDirective {}

@Directive({ selector: '[button-page]' })
export class ButtonPageDirective {}

@Directive({ selector: '[button-ellipsis]' })
export class ButtonEllipsisDirective {}

@Component({
  selector: 'ngx-folio',
  styleUrls: ['./ngx-folio.component.scss'],
  providers: [ValidatorService],
  template: `
    <ul class="pagination">
      <li class="pagination__item">
        <ng-container
          [ngTemplateOutlet]="customPrevTemplate || defaultPrevTemplate"
          [ngTemplateOutletContext]="{ $implicit: getPrevPage(), disabled: isDisabledPrev() }"
        >
        </ng-container>
      </li>
      <ng-container *ngFor="let item of pages">
        <li class="pagination__item" *ngIf="item !== ELLIPSIS_MARKER">
          <ng-container
            [ngTemplateOutlet]="customPageTemplate || defaultPageTemplate"
            [ngTemplateOutletContext]="{ $implicit: item, active: isActive(item) }"
          >
          </ng-container>
        </li>
        <li class="pagination__item" *ngIf="item === ELLIPSIS_MARKER">
          <ng-container [ngTemplateOutlet]="customEllipsisTemplate || defaultEllipsisTemplate"></ng-container>
        </li>
      </ng-container>
      <li class="pagination__item">
        <ng-container
          [ngTemplateOutlet]="customNextTemplate || defaultNextTemplate"
          [ngTemplateOutletContext]="{ $implicit: getNextPage(), disabled: isDisabledNext() }"
        >
        </ng-container>
      </li>
    </ul>
    <ng-template #defaultPrevTemplate let-disabled="disabled">
      <button
        class="pagination__default-button pagination__direction"
        [disabled]="disabled"
        (click)="pickPage(getPrevPage())"
      >
        {{ '<' }}
      </button>
    </ng-template>
    <ng-template #defaultNextTemplate let-disabled="disabled">
      <button
        class="pagination__default-button pagination__direction"
        [disabled]="disabled"
        (click)="pickPage(getNextPage())"
      >
        {{ '>' }}
      </button>
    </ng-template>
    <ng-template #defaultPageTemplate let-page let-active="active">
      <button
        class="pagination__default-button pagination__default-button_page"
        [disabled]="active"
        (click)="pickPage(page)"
      >
        {{ page }}
      </button>
    </ng-template>
    <ng-template #defaultEllipsisTemplate>
      <button class="pagination__default-button" disabled>...</button>
    </ng-template>
  `,
})
export class NgxFolioComponent implements OnChanges {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() collectionSize!: number;

  @Input() startSegmentMax = 3;
  @Input() cursorSegmentMax = 5;
  @Input() endSegmentMax = 3;

  @Output() pageChange = new EventEmitter<number>();

  @ContentChild(ButtonPrevDirective, { read: TemplateRef }) customPrevTemplate?: TemplateRef<unknown>;
  @ContentChild(ButtonNextDirective, { read: TemplateRef }) customNextTemplate?: TemplateRef<unknown>;
  @ContentChild(ButtonPageDirective, { read: TemplateRef }) customPageTemplate?: TemplateRef<unknown>;
  @ContentChild(ButtonEllipsisDirective, { read: TemplateRef }) customEllipsisTemplate?: TemplateRef<unknown>;

  pages: PagesLayout = [];

  readonly ELLIPSIS_MARKER = '...' as const;

  constructor(private readonly validator: ValidatorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.validateInputs();
    this.render();
  }

  pickPage(nextPage: number): void {
    this.page = nextPage;
    this.pageChange.emit(nextPage);
  }

  isDisabledPrev(): boolean {
    return this.page <= 1;
  }

  isDisabledNext(): boolean {
    return this.page >= this.getMaxPage();
  }

  isActive(targetPage: number): boolean {
    return this.page === targetPage;
  }

  getPrevPage(): number {
    return this.page - 1;
  }

  getNextPage(): number {
    return this.page + 1;
  }

  private getMaxPage(): number {
    return Math.ceil(this.collectionSize / this.pageSize);
  }

  private validateInputs(): void {
    const { errors } = this.validator.validate(this as {}, {
      page: { type: 'integer', min: 1 },
      pageSize: { type: 'integer', min: 1 },
      collectionSize: { type: 'integer', min: 0 },
      cursorSegmentMax: { type: 'integer', min: 1 },
      startSegmentMax: { type: 'integer', min: 1 },
      endSegmentMax: { type: 'integer', min: 1 },
    });

    checkValidationErrors(errors, 'Invalid NgxFolioComponent inputs');

    if (errors.length) {
      throw new Error(`Inputs validation error! \n${errors.map((error) => error.message).join('\n')}`);
    }
  }

  private render(): void {
    this.pages = this.createLayout();
  }

  private createLayout(): PagesLayout {
    const lastPage = this.getMaxPage();
    const paginationLength = this.startSegmentMax + this.endSegmentMax + this.cursorSegmentMax;
    if (paginationLength >= this.getMaxPage()) {
      return this.createPagesRange(1, lastPage);
    }

    const startSegment = this.createPagesRange(1, this.startSegmentMax);
    const leftEndBoundary = lastPage - this.endSegmentMax + 1;
    const endSegment = this.createPagesRange(leftEndBoundary, lastPage);
    const fullCursorSegment = this.createPagesRange(this.startSegmentMax + 1, leftEndBoundary - 1);
    const cursorSegment = this.createCursorSegment(fullCursorSegment);

    const result: PagesLayout = [];
    result.push(...startSegment);
    if (!this.isCoupled(result, cursorSegment)) {
      result.push(this.ELLIPSIS_MARKER);
    }
    result.push(...cursorSegment);
    if (!this.isCoupled(result, endSegment)) {
      result.push(this.ELLIPSIS_MARKER);
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

    return lastLayoutItem === (firstSegmentItem - 1);
  }


  private createCursorSegment(fullCursorSegment: number[]): number[] {
    const activePageIdx = fullCursorSegment.indexOf(this.page);
    const splitIdx = activePageIdx === -1 ? Math.ceil((fullCursorSegment.length - 1) / 2) : activePageIdx;
    const referencePage = fullCursorSegment[splitIdx];
    const beforeActive = fullCursorSegment.slice(0, splitIdx);
    const afterActive = fullCursorSegment.slice(splitIdx + 1, Infinity);

    return this.populateCursorSegment(referencePage, beforeActive, afterActive);
  }

  private populateCursorSegment(referencePage: number, before: number[], after: number[]): number[] {
    const result = [referencePage];

    let i = result.length;
    while ((before.length || after.length) && i < this.cursorSegmentMax) {
      if (before.length) {
        result.unshift(before.pop() as number);
        i += 1;
      }
      if (i < this.cursorSegmentMax && after.length) {
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
