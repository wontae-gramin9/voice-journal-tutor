import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDetail } from './audio-detail';

describe('Detail', () => {
  let component: AudioDetail;
  let fixture: ComponentFixture<AudioDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
