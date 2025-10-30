import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyControlCenterAccessComponent } from './my-control-center-access.component';

describe('MyControlCenterAccessComponent', () => {
  let component: MyControlCenterAccessComponent;
  let fixture: ComponentFixture<MyControlCenterAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyControlCenterAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyControlCenterAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
