import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcomapnyComponent } from './showcomapny.component';

describe('ShowcomapnyComponent', () => {
  let component: ShowcomapnyComponent;
  let fixture: ComponentFixture<ShowcomapnyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowcomapnyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcomapnyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
