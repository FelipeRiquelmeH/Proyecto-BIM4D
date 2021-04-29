import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcTreetableComponent } from './fc-treetable.component';

describe('FcTreetableComponent', () => {
  let component: FcTreetableComponent;
  let fixture: ComponentFixture<FcTreetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FcTreetableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FcTreetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
