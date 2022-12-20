import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaloonComponent } from './baloon.component';

describe('BaloonComponent', () => {
  let component: BaloonComponent;
  let fixture: ComponentFixture<BaloonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaloonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaloonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
