import { initDeviceModule } from "../index";
import type { DeviceRegisterResponseOk, DeviceRegisterResponseError } from "../index";

describe('Register Device', () => {
    const body = {
        uuid: 'test-device-id',
        token: 'test-token',
    };

    const mockedFetch = jest.fn().mockImplementation(() => {
        return new Response (JSON.stringify(body), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        })
    });

    const api = initDeviceModule(mockedFetch);

    it('should register device successfully', async () => {
        const okPayload: DeviceRegisterResponseOk = { message: 'Successfully registered' };
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(okPayload), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.registerDevice(body.uuid, body.token);
        expect(response).toEqual(okPayload);
        expect(response).toHaveProperty('message', 'Successfully registered');
    });

    it('should return error on forbidden request', async () => {
        const errorPayload : DeviceRegisterResponseError = { error: 'Forbidden' };
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(errorPayload), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        await expect(api.registerDevice(body.uuid, body.token))
            .rejects.toThrow('Failed to register device: 403');
    });

    it('should throw an error on network failure', async () => {
        mockedFetch.mockRejectedValueOnce(new Error('Network Error'));

        await expect(api.registerDevice(body.uuid, body.token))
            .rejects.toThrow('Network Error');
    });
})