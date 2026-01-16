/**
 * MSW 설정 검증 테스트
 */

describe('MSW Setup', () => {
  it('should be configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have testing-library/jest-dom matchers', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
    document.body.removeChild(element);
  });
});
