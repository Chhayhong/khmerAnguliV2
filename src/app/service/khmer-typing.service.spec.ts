import { TestBed } from '@angular/core/testing';

import { KhmerTypingService } from './khmer-typing.service';

describe('KhmerTypingService', () => {
  let service: KhmerTypingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhmerTypingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
