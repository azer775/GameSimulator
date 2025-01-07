import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowgameComponent } from './showgame.component';

describe('ShowgameComponent', () => {
  let component: ShowgameComponent;
  let fixture: ComponentFixture<ShowgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowgameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
