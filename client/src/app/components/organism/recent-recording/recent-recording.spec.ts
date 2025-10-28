import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentRecording } from './recent-recording';

describe('RecentRecording', () => {
  let component: RecentRecording;
  let fixture: ComponentFixture<RecentRecording>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentRecording],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentRecording);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
