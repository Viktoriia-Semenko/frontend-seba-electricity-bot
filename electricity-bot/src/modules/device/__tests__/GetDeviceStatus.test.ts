import {initDeviceModule} from "../index";
import type {DeviceHistory} from "../index";

describe('Get Device History', () => {

    beforeEach(() => {
        localStorage.setItem('bot-session', 'test-token');
    })

    afterEach(() => {
        localStorage.clear();
    });

    const mockedFetch = jest.fn().mockImplementation(() => {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    });

    const api = initDeviceModule(mockedFetch);

    it('should fetch device history successfully', async () => {
        const mockHistory: DeviceHistory = {
            history: [
                { status: "ON", timestamp: '2023-10-01T00:00:00Z' },
                { status: "OFF", timestamp: '2023-10-02T00:00:00Z' }
            ]
        };

        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockHistory), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory('test-device-id');
        expect(response).toEqual(mockHistory);
    });

    it('should throw an error on network failure', async () => {
        mockedFetch.mockRejectedValueOnce(new Error('Network Error'));

        await expect(api.getDeviceHistory('test-device-id'))
            .rejects.toThrow('Network Error');
    });

    it('should throw an error on non-200 response', async () => {
        mockedFetch.mockResolvedValueOnce(new Response(null, { status: 404 }));

        await expect(api.getDeviceHistory('test-device-id'))
            .rejects.toThrow('Failed to fetch device history: 404');
    });
});