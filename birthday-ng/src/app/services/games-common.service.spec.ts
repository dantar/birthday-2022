import { TestBed } from '@angular/core/testing';

import { GamesCommonService } from './games-common.service';

describe('GamesCommonService', () => {
  let service: GamesCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
