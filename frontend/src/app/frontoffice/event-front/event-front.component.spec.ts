import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFrontComponent } from './event-front.component';

describe('EventFrontComponent', () => {
  let component: EventFrontComponent;
  let fixture: ComponentFixture<EventFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
