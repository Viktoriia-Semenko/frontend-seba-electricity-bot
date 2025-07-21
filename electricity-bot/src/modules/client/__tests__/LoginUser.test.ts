import { initUserAPI } from '../index';

const mockFetch = jest.fn();
const api = initUserAPI(mockFetch);

const mockUser = {
    id: 1,
    firstName: 'Taras',
    lastName: 'Shevchenko',
    email: 'taras.shevchenko@example.com',
    gender: 'male',
    token: 'abc123',
    avatarUrl: 'https://example.com/avatar.png',
    timeZone: 'UTC+2'
};

describe('clients module', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    it('should login user successfully', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                text: async () => JSON.stringify({ token: mockUser.token })
            })

            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser
            });

        const user = await api.loginUser({
            email: 'taras.shevchenko@example.com',
            password: 'password123'
        });

        expect(user.email).toBe('taras.shevchenko@example.com');
    });


    it('should throw error if login fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

        await expect(api.loginUser({email: 'lesya.ukrainka@mail.com', password: '123'})).rejects.toThrow('Login failed');
    });

    it('should throw error if response does not match UserSchema', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                text: async () => JSON.stringify({ token: mockUser.token })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ invalid: 'data' })
            });

        await expect(api.loginUser({email: 'ivan.franko@example.com', password: 'qwerty'}))
            .rejects.toThrow('Data is not valid');
    });

    it('should throw error if token field is missing in response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: async () => JSON.stringify({})
        });

        await expect(api.loginUser({
            email: 'ivan.franko@example.com',
            password: 'qwerty'
        })).rejects.toThrow('Data is not valid');
    });
});
