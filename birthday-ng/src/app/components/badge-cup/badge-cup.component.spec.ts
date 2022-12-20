import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeCupComponent } from './badge-cup.component';

describe('BadgeCupComponent', () => {
  let component: BadgeCupComponent;
  let fixture: ComponentFixture<BadgeCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeCupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
