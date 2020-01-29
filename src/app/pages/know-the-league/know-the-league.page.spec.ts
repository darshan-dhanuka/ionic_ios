import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowTheLeaguePage } from './know-the-league.page';

describe('KnowTheLeaguePage', () => {
  let component: KnowTheLeaguePage;
  let fixture: ComponentFixture<KnowTheLeaguePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowTheLeaguePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowTheLeaguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
