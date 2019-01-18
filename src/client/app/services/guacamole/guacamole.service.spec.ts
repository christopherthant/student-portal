import { TestBed, inject } from '@angular/core/testing';

import { GuacamoleService } from './guacamole.service';

describe('GuacamoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuacamoleService]
    });
  });

  it('should be created', inject([GuacamoleService], (service: GuacamoleService) => {
    expect(service).toBeTruthy();
  }));
});
