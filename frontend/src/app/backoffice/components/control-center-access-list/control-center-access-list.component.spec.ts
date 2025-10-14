import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterAccessListComponent } from './control-center-access-list.component';

describe('ControlCenterAccessListComponent', () => {
  let component: ControlCenterAccessListComponent;
  let fixture: ComponentFixture<ControlCenterAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlCenterAccessListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlCenterAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
