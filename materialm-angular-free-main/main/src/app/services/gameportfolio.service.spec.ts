import { TestBed } from '@angular/core/testing';

import { GameportfolioService } from './gameportfolio.service';

describe('GameportfolioService', () => {
  let service: GameportfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameportfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
