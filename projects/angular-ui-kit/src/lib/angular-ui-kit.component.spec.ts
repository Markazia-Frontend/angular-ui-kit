import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularUiKitComponent } from './angular-ui-kit.component';

describe('AngularUiKitComponent', () => {
  let component: AngularUiKitComponent;
  let fixture: ComponentFixture<AngularUiKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularUiKitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularUiKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
