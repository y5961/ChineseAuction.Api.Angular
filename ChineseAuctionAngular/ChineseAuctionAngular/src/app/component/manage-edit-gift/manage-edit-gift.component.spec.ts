import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEditGiftComponent } from './manage-edit-gift.component';

describe('ManageEditGiftComponent', () => {
  let component: ManageEditGiftComponent;
  let fixture: ComponentFixture<ManageEditGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEditGiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEditGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
