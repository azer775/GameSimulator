import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameclockComponent } from './gameclock.component';

describe('GameclockComponent', () => {
  let component: GameclockComponent;
  let fixture: ComponentFixture<GameclockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameclockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameclockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
