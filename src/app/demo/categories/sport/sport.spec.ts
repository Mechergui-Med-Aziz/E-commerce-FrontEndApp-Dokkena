import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sport } from './sport';

describe('Sport', () => {
  let component: Sport;
  let fixture: ComponentFixture<Sport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
