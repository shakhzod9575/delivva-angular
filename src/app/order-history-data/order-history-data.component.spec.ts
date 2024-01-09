import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryDataComponent } from './order-history-data.component';

describe('OrderHistoryDataComponent', () => {
  let component: OrderHistoryDataComponent;
  let fixture: ComponentFixture<OrderHistoryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistoryDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
