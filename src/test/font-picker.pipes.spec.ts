import { FontSizePipe } from '../lib/font-picker.pipes';

describe('Font picker pipes: FontSizePipe', () => {
  let pipe: FontSizePipe;

  beforeEach(() => {
    pipe = new FontSizePipe();
  });

  it('should create pipe', () => {
    expect(pipe).not.toBeNull();
    expect(pipe).toBeDefined();
  });
});
