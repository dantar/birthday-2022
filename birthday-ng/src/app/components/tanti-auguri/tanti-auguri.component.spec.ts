import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TantiAuguriComponent } from './tanti-auguri.component';

describe('TantiAuguriComponent', () => {
  let component: TantiAuguriComponent;
  let fixture: ComponentFixture<TantiAuguriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TantiAuguriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TantiAuguriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
