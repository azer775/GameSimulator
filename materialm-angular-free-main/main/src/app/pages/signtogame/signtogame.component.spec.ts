import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigntogameComponent } from './signtogame.component';

describe('SigntogameComponent', () => {
  let component: SigntogameComponent;
  let fixture: ComponentFixture<SigntogameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigntogameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigntogameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
