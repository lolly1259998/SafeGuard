import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCameraAccessComponent } from './my-camera-access.component';

describe('MyCameraAccessComponent', () => {
  let component: MyCameraAccessComponent;
  let fixture: ComponentFixture<MyCameraAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCameraAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCameraAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
