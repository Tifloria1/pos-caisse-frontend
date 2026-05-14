import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseSession } from './caisse-session';

describe('CaisseSession', () => {
  let component: CaisseSession;
  let fixture: ComponentFixture<CaisseSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseSession);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
