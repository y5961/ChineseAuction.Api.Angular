import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGiftComponent } from './manage-gift.component';

describe('ManageGiftComponent', () => {
  let component: ManageGiftComponent;
  let fixture: ComponentFixture<ManageGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
