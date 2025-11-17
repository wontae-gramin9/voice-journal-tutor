import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentGraph } from './sentiment-graph';

describe('SentimentGraph', () => {
  let component: SentimentGraph;
  let fixture: ComponentFixture<SentimentGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentGraph],
    }).compileComponents();

    fixture = TestBed.createComponent(SentimentGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
