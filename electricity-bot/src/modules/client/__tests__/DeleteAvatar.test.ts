import { initUserAPI } from '../index';
import {SESSION_KEY} from "../../../constants/session";

describe('initUserAPI', () => {
    const mockFetch = jest.fn();
    const api = initUserAPI(mockFetch as unknown as typeof fetch);
    const fakeToken = 'fake-token';

    beforeEach(() => {
        mockFetch.mockReset();
        localStorage.clear();
    });

    describe('deleteAvatar', () => {
        beforeEach(() => localStorage.setItem(SESSION_KEY, fakeToken));

        it('deletes avatar and returns user', async () => {
            const responseBody = {
                id: 5,
                firstName: 'H',
                lastName: 'I',
                email: 'h@i.com',
                gender: 'male',
                token: fakeToken
            };
            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), {status: 200}));

            const user = await api.deleteAvatar();
            expect(user).toEqual(responseBody);
            expect(mockFetch).toHaveBeenCalledWith(
                `/user/avatar`,
                expect.objectContaining({
                    method: 'DELETE',
                    headers: {Authorization: `Bearer ${fakeToken}`},
                })
            );
        });

        it('throws on delete failure', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, {status: 404}));
            await expect(api.deleteAvatar()).rejects.toThrow('Failed to delete avatar');
        });
    });
});