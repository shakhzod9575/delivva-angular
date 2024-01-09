import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeDataComponent } from './dispute-data.component';

describe('DisputeDataComponent', () => {
  let component: DisputeDataComponent;
  let fixture: ComponentFixture<DisputeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
