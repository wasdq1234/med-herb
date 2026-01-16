import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Node.js 환경용 MSW 서버
 * 테스트 환경에서 API 목 응답을 제공합니다.
 */
export const server = setupServer(...handlers);
