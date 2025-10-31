import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiPerformanceDashboardComponent } from './ai-performance-dashboard/ai-performance-dashboard.component';
import { ScenarioService } from './scenario.service';
import { ScenarioAIService } from './scenario-ai.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AiPerformanceDashboardComponent', () => {
  let component: AiPerformanceDashboardComponent;
  let fixture: ComponentFixture<AiPerformanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPerformanceDashboardComponent, HttpClientTestingModule],
      providers: [ScenarioService, ScenarioAIService]
    }).compileComponents();

    fixture = TestBed.createComponent(AiPerformanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});