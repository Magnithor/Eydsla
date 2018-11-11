import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCategoryTableComponent } from './total-category-table.component';

describe('TotalCategoryTableComponent', () => {
  let component: TotalCategoryTableComponent;
  let fixture: ComponentFixture<TotalCategoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCategoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCategoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
