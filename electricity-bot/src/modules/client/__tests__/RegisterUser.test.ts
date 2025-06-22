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

    it('should throw error if email is already registered', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 409 });

        await expect(api.registerUser({
            firstName: 'Ivan',
            lastName: 'Franko',
            email: 'ivan.franko@example.com',
            password: '123',
            gender: 'male'
        })).rejects.toThrow('Registration failed');
    });

    it('should throw error if server returns invalid JSON structure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: '1',
                firstName: 'Ivan'
                // немає lastName, email, token
            })
        });

        await expect(api.registerUser({
            firstName: 'Ivan',
            lastName: 'Franko',
            email: 'ivan.franko@example.com',
            password: '123',
            gender: 'male'
        })).rejects.toThrow(/Data is not valid/i);
    });

});
