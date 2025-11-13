import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoreListaPage } from './lore-lista.page';

describe('LoreListaPage', () => {
  let component: LoreListaPage;
  let fixture: ComponentFixture<LoreListaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoreListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
