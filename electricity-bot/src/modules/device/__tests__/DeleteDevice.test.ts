import {initDeviceModule} from "../index";

describe("DeleteDevice", () => {

    beforeEach(() => {
        localStorage.setItem('bot-session', 'test-token');
    })

    afterEach(() => {
        localStorage.clear();
    });

    const mockedFetch = jest.fn().mockImplementation(() => {
        return new Response(JSON.stringify({}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer test-token'
            }
        });
    });

    const api = initDeviceModule(mockedFetch);

    it("should delete device successfully", async () => {
        const deviceId = "test-device-id";
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.deleteDevice(deviceId);
        expect(response).toEqual({});
    });

    it("should throw an error on network failure", async () => {
        mockedFetch.mockRejectedValueOnce(new Error("Network Error"));

        await expect(api.deleteDevice("test-device-id"))
            .rejects.toThrow("Network Error");
    });

    it("should throw an error on non-200 response", async () => {
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        await expect(api.deleteDevice("test-device-id"))
            .rejects.toThrow("Failed to delete device: 404");
    });
})