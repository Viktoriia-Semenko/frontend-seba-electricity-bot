import { initUserAPI } from '../index';

const mockFetch = jest.fn();
const api = initUserAPI(mockFetch);

describe('token utilities', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should save and get token', () => {
        api.saveToken('xyz789');
        const token = api.getToken();
        expect(token).toBe('xyz789');
    });

    it('should remove token', () => {
        localStorage.setItem('bot-session', 'abc123');
        api.removeToken();
        expect(localStorage.getItem('bot-session')).toBeNull();
    });
});
