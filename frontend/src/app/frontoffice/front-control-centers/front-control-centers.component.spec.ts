import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontControlCentersComponent } from './front-control-centers.component';

describe('FrontControlCentersComponent', () => {
  let component: FrontControlCentersComponent;
  let fixture: ComponentFixture<FrontControlCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontControlCentersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontControlCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
