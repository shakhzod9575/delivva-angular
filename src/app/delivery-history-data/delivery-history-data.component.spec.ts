import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHistoryDataComponent } from './delivery-history-data.component';

describe('DeliveryHistoryDataComponent', () => {
  let component: DeliveryHistoryDataComponent;
  let fixture: ComponentFixture<DeliveryHistoryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryHistoryDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
