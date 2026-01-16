import '@testing-library/jest-dom';
import { server } from '../mocks/server';

// MSW 서버 설정
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
