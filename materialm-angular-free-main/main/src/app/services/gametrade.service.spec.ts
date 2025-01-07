import { TestBed } from '@angular/core/testing';

import { GametradeService } from './gametrade.service';

describe('GametradeService', () => {
  let service: GametradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GametradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
