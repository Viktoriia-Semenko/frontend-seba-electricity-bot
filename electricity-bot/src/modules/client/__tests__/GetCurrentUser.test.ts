import { initUserAPI } from '../index';

const mockFetch = jest.fn();
const api = initUserAPI(mockFetch);

describe('getCurrentUser', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    it('should return user data if token exists and response is valid', async () => {
        const mockUser = {
            id: '1',
            firstName: 'Ivan',
            lastName: 'Franko',
            email: 'ivan@example.com',
            gender: 'male',
            token: 'abc123',
            timeZone: 'America/New_York',
            avatarUrl: 'https://example.com/avatar.png',
        };

        localStorage.setItem('bot-session', 'abc123');

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        const user = await api.getCurrentUser();

        expect(user.email).toBe('ivan@example.com');
    });

    it('should throw if no token is stored', async () => {
        await expect(api.getCurrentUser()).rejects.toThrow('No token found');
    });

    it('should throw if server returns !ok', async () => {
        localStorage.setItem('bot-session', 'abc123');

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        await expect(api.getCurrentUser()).rejects.toThrow('Failed to fetch current user');
    });

    it('should throw if returned data is invalid', async () => {
        localStorage.setItem('bot-session', 'abc123');

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ foo: 'bar' }),
        });

        await expect(api.getCurrentUser()).rejects.toThrow('Data is not valid');
    });

    it('should return user with avatar and timeZone if present', async () => {
        const mockUser = {
            id: '1',
            firstName: 'Taras',
            lastName: 'Shevchenko',
            email: 'taras@example.com',
            gender: 'male',
            token: 'abc123',
            avatarUrl: 'https://example.com/avatar.png',
            timeZone: 'UTC+2',
        };

        localStorage.setItem('bot-session', 'abc123');

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        const user = await api.getCurrentUser();

        expect(user.timeZone).toBe('UTC+2');
    });

});
