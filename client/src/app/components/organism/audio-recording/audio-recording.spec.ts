import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRecording } from './audio-recording';

describe('AudioRecording', () => {
  let component: AudioRecording;
  let fixture: ComponentFixture<AudioRecording>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioRecording],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioRecording);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
