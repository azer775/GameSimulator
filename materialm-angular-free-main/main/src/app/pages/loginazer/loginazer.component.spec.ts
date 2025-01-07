import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginazerComponent } from './loginazer.component';

describe('LoginazerComponent', () => {
  let component: LoginazerComponent;
  let fixture: ComponentFixture<LoginazerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginazerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginazerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
