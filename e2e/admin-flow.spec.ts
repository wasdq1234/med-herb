/**
 * 관리자 플로우 E2E 테스트
 *
 * 사용자 시나리오:
 * 1. 관리자 로그인
 * 2. 대시보드 접근
 * 3. 데이터 CRUD 작업
 */

import { test, expect } from '@playwright/test';

// 테스트용 관리자 계정 (MSW mock 사용 - handlers/admin.ts 참조)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password',
};

test.describe('관리자 로그인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('로그인 페이지가 정상적으로 로드됨', async ({ page }) => {
    // 로그인 폼 확인
    await expect(page.getByRole('heading', { name: '관리자 로그인' })).toBeVisible();
    await expect(page.getByLabel('아이디')).toBeVisible();
    await expect(page.getByLabel('비밀번호')).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
  });

  test('잘못된 자격 증명으로 로그인 실패', async ({ page }) => {
    // 잘못된 정보 입력
    await page.getByLabel('아이디').fill('wronguser');
    await page.getByLabel('비밀번호').fill('wrongpass');
    await page.getByRole('button', { name: '로그인' }).click();

    // 에러 발생 시 로그인 페이지에 머물러 있어야 함
    // (401 인터셉터가 redirect하지만 로그인 페이지로 감)
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('/admin/login');

    // 또는 에러 메시지가 있으면 확인
    const alert = page.getByRole('alert');
    const alertVisible = await alert.isVisible().catch(() => false);
    if (alertVisible) {
      await expect(alert).toContainText('올바르지 않습니다');
    }
  });

  test('올바른 자격 증명으로 로그인 성공', async ({ page }) => {
    // 올바른 정보 입력
    await page.getByLabel('아이디').fill(ADMIN_CREDENTIALS.username);
    await page.getByLabel('비밀번호').fill(ADMIN_CREDENTIALS.password);
    await page.getByRole('button', { name: '로그인' }).click();

    // 대시보드로 이동 확인
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.getByText('관리자 대시보드')).toBeVisible();
  });
});

test.describe('관리자 대시보드', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 수행
    await page.goto('/admin/login');
    await page.getByLabel('아이디').fill(ADMIN_CREDENTIALS.username);
    await page.getByLabel('비밀번호').fill(ADMIN_CREDENTIALS.password);
    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('대시보드 통계 카드가 표시됨', async ({ page }) => {
    // 통계 카드 확인 (exact: true로 정확히 매칭)
    await expect(page.getByText('증상', { exact: true })).toBeVisible();
    await expect(page.getByText('질문', { exact: true })).toBeVisible();
    await expect(page.getByText('변증', { exact: true })).toBeVisible();
    await expect(page.getByText('약재', { exact: true })).toBeVisible();
  });

  test('네비게이션 메뉴가 표시됨', async ({ page }) => {
    // 네비게이션 항목 확인 (사이드바의 링크로 확인)
    await expect(page.getByRole('link', { name: /증상 관리/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /질문 관리/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /변증 관리/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /약재 관리/ })).toBeVisible();
  });

  test('로그아웃 버튼이 동작함', async ({ page }) => {
    // 로그아웃 버튼 클릭
    await page.getByRole('button', { name: '로그아웃' }).click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL('/admin/login');
  });
});

test.describe('관리자 데이터 관리', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 수행
    await page.goto('/admin/login');
    await page.getByLabel('아이디').fill(ADMIN_CREDENTIALS.username);
    await page.getByLabel('비밀번호').fill(ADMIN_CREDENTIALS.password);
    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('증상 관리 페이지로 네비게이션', async ({ page }) => {
    // 증상 관리 클릭
    await page.getByText('증상 관리').first().click();

    // URL 및 페이지 내용 확인
    await expect(page).toHaveURL('/admin/symptoms');
  });

  test('질문 관리 페이지로 네비게이션', async ({ page }) => {
    // 질문 관리 클릭
    await page.getByText('질문 관리').first().click();

    // URL 확인
    await expect(page).toHaveURL('/admin/questions');
  });

  test('변증 관리 페이지로 네비게이션', async ({ page }) => {
    // 변증 관리 클릭
    await page.getByText('변증 관리').first().click();

    // URL 확인
    await expect(page).toHaveURL('/admin/syndromes');
  });

  test('약재 관리 페이지로 네비게이션', async ({ page }) => {
    // 약재 관리 클릭
    await page.getByText('약재 관리').first().click();

    // URL 확인
    await expect(page).toHaveURL('/admin/herbs');
  });
});

test.describe('관리자 인증 보호', () => {
  test('미인증 상태에서 대시보드 접근 시 로그인 안내', async ({ page }) => {
    // 직접 대시보드 URL 접근
    await page.goto('/admin/dashboard');

    // 로그인 필요 메시지 확인
    await expect(page.getByText('로그인이 필요합니다')).toBeVisible();
  });
});

test.describe('관리자 전체 플로우', () => {
  test('로그인 → 대시보드 → 네비게이션 → 로그아웃', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('/admin/login');

    // 2. 로그인 수행
    await page.getByLabel('아이디').fill(ADMIN_CREDENTIALS.username);
    await page.getByLabel('비밀번호').fill(ADMIN_CREDENTIALS.password);
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 대시보드 확인
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.getByText('관리자 대시보드')).toBeVisible();

    // 4. 통계 확인
    await expect(page.getByText('증상', { exact: true })).toBeVisible();
    await expect(page.getByText('질문', { exact: true })).toBeVisible();

    // 5. 네비게이션 테스트 - 증상 관리
    await page.getByText('증상 관리').first().click();
    await expect(page).toHaveURL('/admin/symptoms');

    // 6. 대시보드로 돌아가기 (로고 클릭 또는 뒤로가기)
    await page.goBack();
    await expect(page).toHaveURL('/admin/dashboard');

    // 7. 로그아웃
    await page.getByRole('button', { name: '로그아웃' }).click();
    await expect(page).toHaveURL('/admin/login');

    // 8. 다시 대시보드 접근 시도 - 인증 필요
    await page.goto('/admin/dashboard');
    await expect(page.getByText('로그인이 필요합니다')).toBeVisible();
  });
});
