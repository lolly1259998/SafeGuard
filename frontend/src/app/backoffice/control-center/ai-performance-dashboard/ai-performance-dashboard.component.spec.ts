import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPerformanceDashboardComponent } from './ai-performance-dashboard.component';

describe('AiPerformanceDashboardComponent', () => {
  let component: AiPerformanceDashboardComponent;
  let fixture: ComponentFixture<AiPerformanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPerformanceDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiPerformanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
