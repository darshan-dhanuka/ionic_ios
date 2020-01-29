import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelPage } from './user-level.page';

describe('UserLevelPage', () => {
  let component: UserLevelPage;
  let fixture: ComponentFixture<UserLevelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLevelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
