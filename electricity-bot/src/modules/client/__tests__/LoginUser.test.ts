import { initUserAPI } from '../index';

const mockFetch = jest.fn();
const api = initUserAPI(mockFetch);

const mockUser = {
    id: '1',
    firstName: 'Taras',
    lastName: 'Shevchenko',
    email: 'taras.shevchenko@example.com',
    gender: 'male',
    token: 'abc123',
    avatar: 'https://example.com/avatar.png',
    timeZone: 'UTC+2'
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

        const user = await api.loginUser({username: 'taras.shevchenko@example.com', password: 'password123'});

        expect(user.email).toBe('taras.shevchenko@example.com');
        expect(mockFetch).toHaveBeenCalledWith('/api/login', expect.anything());
    });

    it('should throw error if login fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

        await expect(api.loginUser({username: 'lesya.ukrainka@mail.com', password: '123'})).rejects.toThrow('Login failed');
    });

    it('should throw error if response does not match UserSchema', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ invalid: 'data' }),
        });

        await expect(api.loginUser({username: 'ivan.franko@example.com', password: 'qwerty'}))
            .rejects.toThrow('Data is not valid');
    });

    it('should throw error if token field is missing in response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: '1',
                firstName: 'Ivan',
                lastName: 'Franko',
                email: 'ivan.franko@example.com',
                gender: 'male'
            })
        });

        await expect(api.loginUser({username: 'ivan.franko@example.com', password: 'qwerty'}))
            .rejects.toThrow('Data is not valid');
    });
});
