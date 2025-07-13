import { initUserAPI } from '../index';
import {API_MOCK, SESSION_KEY} from "../../../constants/session";

describe('initUserAPI', () => {
    const mockFetch = jest.fn();
    const api = initUserAPI(mockFetch as unknown as typeof fetch);
    const fakeToken = 'fake-token';
    const baseUrl = API_MOCK

    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    describe('uploadAvatar', () => {
        beforeEach(() => localStorage.setItem(SESSION_KEY, fakeToken));

        it('uploads file and returns user', async () => {
            const fakeFile = new File(['a'], 'avatar.png', {type: 'image/png'});
            const responseBody = {
                id: '4',
                firstName: 'F',
                lastName: 'G',
                email: 'f@g.com',
                gender: 'other',
                token: fakeToken,
                avatar: '/path.png'
            };
            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), {status: 200}));

            const user = await api.uploadAvatar(fakeFile);
            expect(user).toEqual(responseBody);
            const [url, opts] = mockFetch.mock.calls[0];
            expect(url).toBe(`${baseUrl}/user/avatar`);
            expect(opts.method).toBe('POST');
            expect(opts.headers).toEqual({Authorization: `Bearer ${fakeToken}`});
            expect(opts.body).toBeInstanceOf(FormData);
        });

        it('throws on upload failure', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, {status: 500}));
            await expect(api.uploadAvatar(new File([], 'a'))).rejects.toThrow('Failed to upload avatar');
        });
    });
});