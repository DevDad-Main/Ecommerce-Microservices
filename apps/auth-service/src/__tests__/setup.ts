import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
(global as any).localStorage = localStorageMock;

// Mock Clerk
vi.mock("@clerk/express", () => ({
  getAuth: vi.fn(),
  clerkMiddleware: vi.fn(() => (req: any, res: any, next: any) => next()),
  clerkClient: {
    users: {
      createUser: vi.fn(),
      getUserList: vi.fn(),
      getUser: vi.fn(),
      deleteUser: vi.fn(),
    },
  },
}));

vi.mock("@clerk/backend", () => ({
  clerkClient: {
    users: {
      createUser: vi.fn(),
      getUserList: vi.fn(),
      getUser: vi.fn(),
      deleteUser: vi.fn(),
    },
  },
}));

// Mock BullMQ if needed
vi.mock("@repo/bullmq", () => ({
  addNewUserEmailJob: vi.fn(() => Promise.resolve({ id: "job123" })),
}));
