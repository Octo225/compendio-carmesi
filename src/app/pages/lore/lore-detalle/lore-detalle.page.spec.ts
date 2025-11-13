import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoreDetallePage } from './lore-detalle.page';

describe('LoreDetallePage', () => {
  let component: LoreDetallePage;
  let fixture: ComponentFixture<LoreDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoreDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
