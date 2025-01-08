import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MygamelistComponent } from './mygamelist.component';

describe('MygamelistComponent', () => {
  let component: MygamelistComponent;
  let fixture: ComponentFixture<MygamelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MygamelistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MygamelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
