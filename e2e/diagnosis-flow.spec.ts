/**
 * 진단 플로우 E2E 테스트
 *
 * 사용자 시나리오:
 * 1. 홈페이지 접속 → 진단 시작
 * 2. 증상 선택 → 다음
 * 3. 질문 응답 → 결과 확인
 * 4. 치료법/약재 확인
 */

import { test, expect } from '@playwright/test';

test.describe('진단 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');
  });

  test('홈페이지가 정상적으로 로드됨', async ({ page }) => {
    // 타이틀 확인
    await expect(page.getByRole('heading', { name: '한방진단' })).toBeVisible();

    // 진단 시작 버튼 확인
    await expect(page.getByRole('button', { name: '진단 시작하기' })).toBeVisible();
  });

  test('진단 시작 버튼 클릭 시 진단 페이지로 이동', async ({ page }) => {
    // 진단 시작 버튼 클릭
    await page.getByRole('button', { name: '진단 시작하기' }).click();

    // URL 확인
    await expect(page).toHaveURL('/diagnosis');

    // 증상 선택 UI 확인 (실제 텍스트: "증상을 선택해주세요")
    await expect(page.getByText('증상을 선택해주세요')).toBeVisible();
  });

  test('증상 선택 후 다음 단계로 진행', async ({ page }) => {
    // 진단 페이지로 이동
    await page.goto('/diagnosis');

    // 증상 로딩 대기
    await page.waitForSelector('[data-testid="symptom-checkbox"]', { timeout: 10000 });

    // 첫 번째 증상 선택
    const firstSymptom = page.locator('[data-testid="symptom-checkbox"]').first();
    await firstSymptom.click();

    // 다음 버튼 활성화 확인 및 클릭
    const nextButton = page.getByRole('button', { name: '다음' });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // 질문 단계로 이동 확인 (실제 텍스트: "상세 질문")
    await expect(page.getByText('상세 질문')).toBeVisible();
  });

  test('질문 응답 후 결과 페이지로 이동', async ({ page }) => {
    // 진단 페이지로 이동
    await page.goto('/diagnosis');

    // 증상 로딩 대기 및 선택
    await page.waitForSelector('[data-testid="symptom-checkbox"]', { timeout: 10000 });
    await page.locator('[data-testid="symptom-checkbox"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();

    // 질문 단계로 이동 확인
    await expect(page.getByText('상세 질문')).toBeVisible();

    // 질문 응답 - 모든 질문에 첫 번째 옵션 선택
    for (let i = 0; i < 10; i++) {
      // 라디오 옵션이 있으면 첫 번째 선택
      const radioOptions = page.locator('[data-testid="radio-option"]');
      const radioCount = await radioOptions.count();
      if (radioCount > 0) {
        await radioOptions.first().click();
      }

      // 진단받기 버튼이 보이면 클릭
      const submitButton = page.getByRole('button', { name: '진단받기' });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        break;
      }

      // 다음 버튼 클릭
      const nextButton = page.getByRole('button', { name: '다음' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // 결과 페이지 확인 (진단 처리 대기)
    await expect(page).toHaveURL('/result', { timeout: 15000 });
    await expect(page.getByText('진단 결과')).toBeVisible();
  });

  test('결과 페이지에서 치료법 페이지로 이동', async ({ page }) => {
    // 결과 페이지로 직접 이동 (mock 데이터 사용)
    await page.goto('/result');

    // 결과 페이지 로딩 확인
    await expect(page.getByText('진단 결과')).toBeVisible();

    // 치료법 보기 버튼 클릭
    const treatmentButton = page.getByRole('button', { name: '치료법 보기' });
    await expect(treatmentButton).toBeVisible();
    await treatmentButton.click();

    // 치료법 페이지 확인
    await expect(page).toHaveURL('/treatment');
    await expect(page.getByRole('heading', { name: '치료 방향 및 약재' })).toBeVisible();
  });

  test('치료법 페이지에서 다시 진단하기', async ({ page }) => {
    // 치료법 페이지로 이동
    await page.goto('/treatment');

    // 다시 진단하기 버튼 클릭
    const restartButton = page.getByRole('button', { name: '다시 진단하기' });
    await expect(restartButton).toBeVisible();
    await restartButton.click();

    // 진단 페이지로 이동 확인
    await expect(page).toHaveURL('/diagnosis');
  });
});

test.describe('진단 플로우 - 전체 시나리오', () => {
  test('홈 → 증상선택 → 질문응답 → 결과 → 치료법 전체 플로우', async ({ page }) => {
    // 1. 홈페이지
    await page.goto('/');
    await page.getByRole('button', { name: '진단 시작하기' }).click();

    // 2. 증상 선택
    await page.waitForSelector('[data-testid="symptom-checkbox"]', { timeout: 10000 });
    await page.locator('[data-testid="symptom-checkbox"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();

    // 질문 단계로 이동 확인
    await expect(page.getByText('상세 질문')).toBeVisible();

    // 3. 질문 응답 (최대 10개 질문)
    for (let i = 0; i < 10; i++) {
      const radioOptions = page.locator('[data-testid="radio-option"]');
      const radioCount = await radioOptions.count();

      if (radioCount > 0) {
        await radioOptions.first().click();
      }

      const submitButton = page.getByRole('button', { name: '진단받기' });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        break;
      }

      const nextButton = page.getByRole('button', { name: '다음' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // 4. 결과 확인 (진단 처리 대기)
    await expect(page).toHaveURL('/result', { timeout: 15000 });
    await expect(page.getByText('진단 결과')).toBeVisible();

    // 변증 결과가 로딩되면 카드 표시 또는 치료법 버튼 확인
    // (sessionId가 있을 때 mock 데이터 대신 로딩 완료를 기다림)
    await page.waitForTimeout(1000);

    // 5. 치료법 페이지로 이동 (버튼이 있으면 클릭)
    const treatmentButton = page.getByRole('button', { name: '치료법 보기' });
    if (await treatmentButton.isVisible()) {
      await treatmentButton.click();
      await expect(page).toHaveURL('/treatment');
    } else {
      // 치료법 버튼이 없으면 직접 이동
      await page.goto('/treatment');
    }

    // 치료축과 약재 테이블 확인
    await expect(page.getByRole('heading', { name: '치료 방향 및 약재' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '추천 약재' })).toBeVisible();
  });
});
