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

    describe('updateUser', () => {
        beforeEach(() => localStorage.setItem(SESSION_KEY, fakeToken));

        it('sends PUT and returns updated user', async () => {
            const updates = {firstName: 'New'};
            const responseBody = {
                id: 3,
                firstName: 'New',
                lastName: 'Y',
                email: 'x@y.com',
                gender: 'female',
                token: fakeToken
            };
            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), {status: 200}));

            const user = await api.updateUser(updates);
            expect(user).toEqual(responseBody);
            expect(mockFetch).toHaveBeenCalledWith(
                `/user/me`,
                expect.objectContaining({
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${fakeToken}`},
                    body: JSON.stringify(updates),
                })
            );
        });

        it('throws on update failure', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, {status: 400}));
            await expect(api.updateUser({})).rejects.toThrow('Failed to update user');
        });
    });
});