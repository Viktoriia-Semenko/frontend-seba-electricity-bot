import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initUserAPI } from '../index';

const mockFetch = vi.fn();
const api = initUserAPI(mockFetch);

const mockUser = {
    id: '2',
    firstName: 'Lesya',
    lastName: 'Ukrainka',
    email: 'lesya.ukrainka@example.com',
    gender: 'female',
    token: 'xyz456'
};

describe('registerUser', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    it('should register user successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser
        });

        const user = await api.registerUser({
            firstName: 'Lesya',
            lastName: 'Ukrainka',
            email: 'lesya.ukrainka@example.com',
            password: '123456',
            gender: 'female'
        });

        expect(user.email).toBe('lesya.ukrainka@example.com');
        expect(mockFetch).toHaveBeenCalledWith('/api/register', expect.anything());
    });

    it('should throw error if registration fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });

        await expect(
            api.registerUser({
                firstName: 'Ivan',
                lastName: 'Franko',
                email: 'ivan.franko@example.com',
                password: 'qwerty',
                gender: 'male'
            })
        ).rejects.toThrow('Registration failed');
    });
});
