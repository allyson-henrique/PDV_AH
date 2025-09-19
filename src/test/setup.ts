import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IndexedDB
const mockIDBRequest = {
  result: {},
  error: null,
  onsuccess: null,
  onerror: null,
}

const mockIDBDatabase = {
  transaction: vi.fn(() => ({
    objectStore: vi.fn(() => ({
      add: vi.fn(() => mockIDBRequest),
      get: vi.fn(() => mockIDBRequest),
      put: vi.fn(() => mockIDBRequest),
      delete: vi.fn(() => mockIDBRequest),
      getAll: vi.fn(() => mockIDBRequest),
    })),
  })),
}

global.indexedDB = {
  open: vi.fn(() => ({
    ...mockIDBRequest,
    result: mockIDBDatabase,
  })),
} as any

// Mock Service Worker
global.navigator.serviceWorker = {
  register: vi.fn(() => Promise.resolve()),
  ready: Promise.resolve({
    unregister: vi.fn(() => Promise.resolve(true)),
  }),
} as any

// Mock Notification API
global.Notification = {
  permission: 'granted',
  requestPermission: vi.fn(() => Promise.resolve('granted')),
} as any

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any