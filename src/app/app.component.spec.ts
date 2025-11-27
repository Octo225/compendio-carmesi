import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    // Reset the body class before each test to ensure a clean state
    document.body.classList.remove('dark');
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: LocalStorage has 'dark'
  it('should apply dark class if localStorage has "dark"', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dark');
    
    // Trigger ngOnInit
    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    expect(document.body.classList.contains('dark')).toBeTrue();
  });

  // Test 2: LocalStorage has 'light'
  it('should remove dark class if localStorage has "light"', () => {
    // Add dark class initially to ensure it gets removed
    document.body.classList.add('dark');
    spyOn(localStorage, 'getItem').and.returnValue('light');

    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    expect(document.body.classList.contains('dark')).toBeFalse();
  });

  // Test 3: No LocalStorage, System prefers Dark
  it('should apply dark class if no localStorage but system prefers dark', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    // Mock window.matchMedia to return matches: true
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {}, // Deprecated but sometimes required by older browsers/tests
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList);

    component.ngOnInit();

    expect(document.body.classList.contains('dark')).toBeTrue();
  });

  // Test 4: No LocalStorage, System prefers Light
  it('should not apply dark class if no localStorage and system prefers light', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Mock window.matchMedia to return matches: false
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList);

    component.ngOnInit();

    expect(document.body.classList.contains('dark')).toBeFalse();
  });
});