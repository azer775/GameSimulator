import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameformComponent } from './gameform.component';

describe('GameformComponent', () => {
  let component: GameformComponent;
  let fixture: ComponentFixture<GameformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
