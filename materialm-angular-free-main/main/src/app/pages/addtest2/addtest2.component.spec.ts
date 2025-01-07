import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtest2Component } from './addtest2.component';

describe('Addtest2Component', () => {
  let component: Addtest2Component;
  let fixture: ComponentFixture<Addtest2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Addtest2Component]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(Addtest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
