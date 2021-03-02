import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { PagesLayout } from './types';
import { checkValidationErrors } from './util';
import { ValidatorService } from './validator.service';
import { ELLIPSIS_MARKER } from './constants';
import { FolioLayoutBuilderService } from './folio-layout-builder.service';

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

  readonly ELLIPSIS_MARKER = ELLIPSIS_MARKER;

  constructor(
    private readonly validator: ValidatorService,
    private readonly layoutBuilder: FolioLayoutBuilderService
  ) {}

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
    this.pages = this.layoutBuilder.createLayout({
      currentPage: this.page,
      pagesAmount: this.getMaxPage(),
      segmentsSizes: {
        start: this.startSegmentMax,
        end: this.endSegmentMax,
        cursor: this.cursorSegmentMax,
      },
    });
  }
}
