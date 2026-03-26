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
