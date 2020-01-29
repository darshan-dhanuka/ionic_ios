import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiAccEventComponent } from './mi-acc-event.component';

describe('MiAccEventComponent', () => {
  let component: MiAccEventComponent;
  let fixture: ComponentFixture<MiAccEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiAccEventComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiAccEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
