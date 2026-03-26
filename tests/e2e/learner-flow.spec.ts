import { expect, test } from '@playwright/test'

test('parent setup can create a profile and complete the first lesson flow', async ({
  page,
}) => {
  await createProfile(page, 'Milo')

  await page.goto('/learn')
  await expect(
    page.getByRole('heading', { name: 'Welcome back, Milo.' })
  ).toBeVisible()

  const startButton = page.getByRole('button', {
    name: 'Start lesson skeleton',
  })
  await expect(startButton).toBeEnabled()
  await startButton.click()

  await expect(page.getByText('Current activity 1 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page.getByRole('button', { name: 'Advance to next activity' }).click()

  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page
    .getByRole('button', { name: 'Confirm second representation' })
    .click()
  await page.getByRole('button', { name: 'Advance to next activity' }).click()

  await expect(page.getByText('Current activity 3 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page.getByRole('button', { name: 'Finish lesson' }).click()

  const wrapUpLink = page.getByRole('link', { name: 'See lesson wrap-up' })
  await expect(wrapUpLink).toBeVisible()
  await wrapUpLink.click()
  await page.waitForURL('**/learn/completed')

  await expect(
    page.getByRole('heading', { name: 'Lesson complete' })
  ).toBeVisible()
  await expect(page.getByText('Stars earned: 3')).toBeVisible()
  await expect(page.getByText('Badge: starter-builder')).toBeVisible()
  await expect(page.getByText('Total stars: 3')).toBeVisible()
})

test('lesson completion updates map progression and parent summary surfaces', async ({
  page,
}) => {
  await createProfile(page, 'Luna')

  await page.goto('/parents')
  await page.getByRole('button', { name: 'owl guide' }).click()
  await expect(page.getByText('Current style: owl-guide')).toBeVisible()

  await completeFirstLesson(page)

  await page.getByRole('link', { name: 'Back to child home' }).click()
  await page.waitForURL('**/learn')
  await expect(
    page.getByText('Next recommended lesson: Build Groups and Equations')
  ).toBeVisible()

  await completeFirstLesson(page)

  await page.getByRole('link', { name: 'Back to child home' }).click()
  await page.waitForURL('**/learn')
  await expect(
    page.getByText('Next recommended lesson: Show and Check Sums Within 5')
  ).toBeVisible()

  await page.goto('/learn/completed')
  await page.getByRole('link', { name: 'View next lesson' }).click()
  await page.waitForURL('**/learn/map')

  await expect(
    page.getByRole('heading', { name: 'World map progression' })
  ).toBeVisible()
  await expect(
    page.getByTestId('map-item-g1-add-within-5-lesson-1')
  ).toContainText('Grade 1 - completed')
  await expect(
    page.getByTestId('map-item-g1-add-within-5-lesson-2')
  ).toContainText('Grade 1 - next')

  await page.getByRole('link', { name: 'Back to child home' }).click()
  await page.waitForURL('**/learn')

  await page.goto('/parents')
  await expect(page.getByTestId('parent-summary-completed')).toContainText('1')
  await expect(page.getByTestId('parent-summary-stars')).toContainText('6')
  await expect(page.getByTestId('parent-summary-recent')).toContainText(
    'Build Groups and Equations'
  )
  await expect(page.getByText('Best stars: 3')).toBeVisible()
  await expect(page.getByText('Badges: starter-builder')).toBeVisible()
  await expect(page.getByText('Map rewards: grade-1-add-1')).toBeVisible()
  await expect(page.getByText('Mode: latest-completion')).toBeVisible()
})

test('safe refresh keeps resumable progress and shows update prompts', async ({
  page,
}) => {
  await createProfile(page, 'Ava')

  await page.goto('/learn')
  await page.getByRole('button', { name: 'Start lesson skeleton' }).click()
  await page.getByRole('button', { name: 'Advance to next activity' }).click()
  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()

  await page.addInitScript(() => {
    window.__MATHINIK_TEST_SW_PROMPT__ = {
      needRefresh: true,
    }
    window.__MATHINIK_TEST_CONTENT_STATUS__ = {
      status: 'update-available',
      cachedVersion: '2026.03.21',
      latestVersion: '2026.04.01',
    }
  })

  await page.goto('/')
  await expect(
    page.getByText('A fresh app version is available.')
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reload app' })).toBeVisible()
  await page.getByRole('button', { name: 'Dismiss' }).click()
  await expect(
    page.locator('body').getByText('A fresh app version is available.')
  ).toHaveCount(0)

  await expect(
    page.getByText('A newer content pack is available: 2026.04.01.')
  ).toBeVisible()
  await page.getByRole('button', { name: 'Apply safe refresh' }).click()
  await expect(
    page.getByText(
      'Content refresh preserved local progress. Reload when ready to use the latest pack.'
    )
  ).toBeVisible()

  await page.goto('/learn')
  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()
  await expect(
    page.getByText('Build the equation that matches the apple groups.')
  ).toBeVisible()

  await page.reload()

  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()
})

test('learner route restores resumable lesson progress after reload', async ({
  page,
}) => {
  await createProfile(page, 'Ava')

  await page.goto('/learn')
  await page.getByRole('button', { name: 'Start lesson skeleton' }).click()
  await expect(page.getByText('Current activity 1 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Advance to next activity' }).click()
  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()

  await page.reload()

  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()
  await expect(
    page.getByText('Build the equation that matches the apple groups.')
  ).toBeVisible()
})

async function createProfile(
  page: import('@playwright/test').Page,
  name: string
) {
  await page.goto('/parents')
  await expect(
    page.getByText('0 profile(s) stored on this device.')
  ).toBeVisible()

  await page.getByRole('textbox', { name: 'Child display name' }).fill(name)
  await page.getByRole('combobox', { name: 'Starting grade' }).selectOption('1')
  await page.getByRole('button', { name: 'Save local profile' }).click()

  await expect(page.getByText(`Name: ${name}`)).toBeVisible()
  await expect(
    page.getByText('1 profile(s) stored on this device.')
  ).toBeVisible()
}

async function completeFirstLesson(page: import('@playwright/test').Page) {
  await page.goto('/learn')
  await expect(page.getByText('Current activity 1 of 3')).toHaveCount(0)

  const startButton = page.getByRole('button', {
    name: 'Start lesson skeleton',
  })
  await expect(startButton).toBeEnabled()
  await startButton.click()

  await expect(page.getByText('Current activity 1 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page.getByRole('button', { name: 'Advance to next activity' }).click()
  await expect(page.getByText('Current activity 2 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page
    .getByRole('button', { name: 'Confirm second representation' })
    .click()
  await page.getByRole('button', { name: 'Advance to next activity' }).click()
  await expect(page.getByText('Current activity 3 of 3')).toBeVisible()

  await page.getByRole('button', { name: 'Record success' }).click()
  await page.getByRole('button', { name: 'Finish lesson' }).click()

  const wrapUpLink = page.getByRole('link', { name: 'See lesson wrap-up' })
  await expect(wrapUpLink).toBeVisible()
  await wrapUpLink.click()
  await page.waitForURL('**/learn/completed')

  await expect(
    page.getByRole('heading', { name: 'Lesson complete' })
  ).toBeVisible()
}
