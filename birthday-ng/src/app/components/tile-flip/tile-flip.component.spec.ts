import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileFlipComponent } from './tile-flip.component';

describe('TileFlipComponent', () => {
  let component: TileFlipComponent;
  let fixture: ComponentFixture<TileFlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TileFlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TileFlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
