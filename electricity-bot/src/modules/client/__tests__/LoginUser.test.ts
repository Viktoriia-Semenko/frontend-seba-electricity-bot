import { initUserAPI } from '../index';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
const api = initUserAPI(mockFetch);

const mockUser = {
    id: '1',
    firstName: 'Taras',
    lastName: 'Shevchenko',
    email: 'taras.shevchenko@example.com',
    gender: 'male',
    token: 'abc123'
};

describe('clients module', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    it('should login user successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser
        });

        const user = await api.loginUser('taras.shevchenko@example.com', 'password123');

        expect(user.email).toBe('taras.shevchenko@example.com');
        expect(mockFetch).toHaveBeenCalledWith('/api/login', expect.anything());
    });

    it('should throw error if login fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

        await expect(api.loginUser('lesya.ukrainka@mail.com', '123')).rejects.toThrow('Login failed');
    });
});
