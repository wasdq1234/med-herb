import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * 브라우저용 MSW 워커
 * 개발 환경에서 API 목 응답을 제공합니다.
 */
export const worker = setupWorker(...handlers);
