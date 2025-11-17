import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Backspace } from './backspace';

describe('Backspace', () => {
  let component: Backspace;
  let fixture: ComponentFixture<Backspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Backspace],
    }).compileComponents();

    fixture = TestBed.createComponent(Backspace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
