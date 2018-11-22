import counter from "./counter";


describe('counter', () => {
  it('should count', () => {
    const c = counter(0);
    expect(c.next().value).toBe(0);
    expect(c.next().value).toBe(1);
  });
});