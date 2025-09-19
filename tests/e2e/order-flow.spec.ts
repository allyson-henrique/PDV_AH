import { test, expect } from '@playwright/test'

test.describe('Complete Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full order flow from login to payment', async ({ page }) => {
    // Login
    await page.fill('[data-testid="username"]', 'joao')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Wait for dashboard to load
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()

    // Navigate to menu
    await page.click('[data-testid="menu-tab"]')
    await expect(page.locator('[data-testid="menu-view"]')).toBeVisible()

    // Add product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Verify product was added to cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()

    // Open cart
    await page.click('[data-testid="cart-button"]')
    await expect(page.locator('[data-testid="cart-view"]')).toBeVisible()

    // Proceed to payment
    await page.click('[data-testid="checkout-button"]')
    await expect(page.locator('[data-testid="payment-modal"]')).toBeVisible()

    // Select payment method
    await page.click('[data-testid="payment-cash"]')

    // Enter cash amount
    await page.fill('[data-testid="cash-amount"]', '50,00')

    // Complete payment
    await page.click('[data-testid="complete-payment"]')

    // Verify order completion
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
    await expect(page.locator('text=Pedido realizado com sucesso')).toBeVisible()
  })

  test('should handle product customization flow', async ({ page }) => {
    // Login as cashier
    await page.fill('[data-testid="username"]', 'joao')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Navigate to menu
    await page.click('[data-testid="menu-tab"]')

    // Find customizable product
    const customizableProduct = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hambúrguer' }).first()
    await customizableProduct.click()

    // Check if customizer opens
    if (await page.locator('[data-testid="product-customizer"]').isVisible()) {
      // Select base ingredient
      await page.click('[data-testid="ingredient-add-button"]').first()
      
      // Go to next step
      await page.click('[data-testid="customizer-next"]')
      
      // Select protein
      await page.click('[data-testid="ingredient-add-button"]').first()
      
      // Continue through steps until finish
      while (await page.locator('[data-testid="customizer-next"]').isVisible()) {
        await page.click('[data-testid="customizer-next"]')
      }
      
      // Finish customization
      await page.click('[data-testid="customizer-finish"]')
    }

    // Verify product was added to cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()
  })

  test('should handle table order flow', async ({ page }) => {
    // Login as waiter
    await page.fill('[data-testid="username"]', 'maria')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Navigate to tables
    await page.click('[data-testid="tables-tab"]')
    await expect(page.locator('[data-testid="tables-view"]')).toBeVisible()

    // Select available table
    const availableTable = page.locator('[data-testid="table-card"]').filter({ hasText: 'Livre' }).first()
    await availableTable.click()

    // Open table order modal
    await expect(page.locator('[data-testid="table-modal"]')).toBeVisible()
    await page.click('[data-testid="start-order-button"]')

    // Fill customer info
    await page.fill('[data-testid="customer-name"]', 'João Silva')
    await page.fill('[data-testid="guest-count"]', '2')
    await page.click('[data-testid="confirm-table-order"]')

    // Add products to order
    await page.click('[data-testid="menu-tab"]')
    const product = page.locator('[data-testid="product-card"]').first()
    await product.click()

    // Complete order
    await page.click('[data-testid="cart-button"]')
    await page.click('[data-testid="checkout-button"]')
    await page.click('[data-testid="payment-cash"]')
    await page.fill('[data-testid="cash-amount"]', '30,00')
    await page.click('[data-testid="complete-payment"]')

    // Verify order success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
  })

  test('should work offline', async ({ page, context }) => {
    // Login first
    await page.fill('[data-testid="username"]', 'joao')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Wait for app to load
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()

    // Go offline
    await context.setOffline(true)

    // Verify offline indicator appears
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()

    // Try to add product to cart (should work offline)
    await page.click('[data-testid="menu-tab"]')
    const product = page.locator('[data-testid="product-card"]').first()
    await product.click()

    // Verify product was added
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()

    // Complete cash payment (should work offline)
    await page.click('[data-testid="cart-button"]')
    await page.click('[data-testid="checkout-button"]')
    await page.click('[data-testid="payment-cash"]')
    await page.fill('[data-testid="cash-amount"]', '25,00')
    await page.click('[data-testid="complete-payment"]')

    // Verify offline order success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
    await expect(page.locator('text=Pedido salvo offline')).toBeVisible()

    // Go back online
    await context.setOffline(false)

    // Verify sync indicator appears
    await expect(page.locator('[data-testid="sync-indicator"]')).toBeVisible({ timeout: 10000 })
  })

  test('should handle kitchen workflow', async ({ page }) => {
    // Login as kitchen staff
    await page.fill('[data-testid="username"]', 'carlos')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Should redirect to kitchen view
    await expect(page.locator('[data-testid="kitchen-view"]')).toBeVisible()

    // Check for pending orders
    const pendingOrders = page.locator('[data-testid="kitchen-order"]')
    if (await pendingOrders.count() > 0) {
      // Start preparing first order
      await pendingOrders.first().locator('[data-testid="start-preparation"]').click()
      
      // Verify order status changed
      await expect(pendingOrders.first().locator('text=Preparando')).toBeVisible()
      
      // Complete preparation
      await pendingOrders.first().locator('[data-testid="complete-preparation"]').click()
      
      // Verify order is ready
      await expect(pendingOrders.first().locator('text=Pronto')).toBeVisible()
    }
  })

  test('should generate reports for manager', async ({ page }) => {
    // Login as manager
    await page.fill('[data-testid="username"]', 'ana')
    await page.fill('[data-testid="password"]', '123456')
    await page.click('[data-testid="login-button"]')

    // Navigate to analytics
    await page.click('[data-testid="analytics-tab"]')
    await expect(page.locator('[data-testid="analytics-view"]')).toBeVisible()

    // Verify KPIs are displayed
    await expect(page.locator('[data-testid="revenue-kpi"]')).toBeVisible()
    await expect(page.locator('[data-testid="orders-kpi"]')).toBeVisible()
    await expect(page.locator('[data-testid="average-ticket-kpi"]')).toBeVisible()

    // Verify charts are rendered
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="payment-methods-chart"]')).toBeVisible()

    // Test date range filter
    await page.click('[data-testid="date-range-30"]')
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible()

    // Test metric toggle
    await page.click('[data-testid="metric-orders"]')
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible()
  })
})