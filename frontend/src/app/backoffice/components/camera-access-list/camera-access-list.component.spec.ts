import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraAccessListComponent } from './camera-access-list.component';

describe('CameraAccessListComponent', () => {
  let component: CameraAccessListComponent;
  let fixture: ComponentFixture<CameraAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraAccessListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
