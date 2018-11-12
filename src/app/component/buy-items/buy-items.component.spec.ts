import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemsComponent } from './buy-items.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BuyItemsComponent', () => {
  let component: BuyItemsComponent;
  let fixture: ComponentFixture<BuyItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ BuyItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
