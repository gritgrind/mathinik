import { expect, test } from '@playwright/test'

test('home shell and navigation render', async ({ page }) => {
  await page.goto('/')
  const header = page.getByRole('banner')

  await expect(
    page.getByRole('heading', {
      name: 'Build math like an adventure, not a worksheet.',
    })
  ).toBeVisible()

  await header.getByRole('link', { name: 'Learn' }).click()
  await expect(
    page.getByRole('heading', {
      name: 'Route space for the child-facing lesson journey.',
    })
  ).toBeVisible()

  await header.getByRole('link', { name: 'Parents' }).click()
  await expect(
    page.getByRole('heading', {
      name: 'Local setup and progress summary will live here.',
    })
  ).toBeVisible()
})
