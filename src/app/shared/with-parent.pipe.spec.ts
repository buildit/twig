import { WithParentPipe } from './with-parent.pipe';

describe('WithParentPipe', () => {
  it('create an instance', () => {
    const pipe = new WithParentPipe();
    expect(pipe).toBeTruthy();
  });
});
