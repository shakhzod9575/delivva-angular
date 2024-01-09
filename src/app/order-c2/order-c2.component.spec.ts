import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderC2Component } from './order-c2.component';

describe('OrderC2Component', () => {
  let component: OrderC2Component;
  let fixture: ComponentFixture<OrderC2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderC2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderC2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
