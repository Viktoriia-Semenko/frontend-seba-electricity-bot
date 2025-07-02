import {initDeviceModule} from "../index";

describe("Get Device ByUser", () => {
    beforeEach(() => {
        localStorage.setItem('bot-session', 'test-token');
    });

    afterEach(() => {
        localStorage.clear();
    });

    const mockedFetch = jest.fn().mockImplementation(() => {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer test-token'
            }
        });
    });

    const api = initDeviceModule(mockedFetch);

    const responseFromServer = {
        devices: [
            { uuid: "device1-uuid", name: "Device One", status: "ON", lastChange: "2023-10-01T12:00:00Z" },
            { uuid: "device2-uuid", name: "Device Two", status: "ON", lastChange: "2023-10-01T12:00:00Z" },
        ]
    }

    it("should fetch devices by user successfully", async () => {
        const userId = "test-user-id";
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseFromServer), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer test-token'
            }
        }));

        const response = await api.getDevicesByUser(userId);
        expect(response.devices[0]).toEqual(responseFromServer.devices[0]);
    });

    it("should throw an error on network failure", async () => {
        mockedFetch.mockRejectedValueOnce(new Error("Network Error"));

        await expect(api.getDevicesByUser("test-user-id"))
            .rejects.toThrow("Network Error");
    });

    it("should throw an error on non-200 response", async () => {
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer test-token'
            }
        }));

        await expect(api.getDevicesByUser("test-user-id"))
            .rejects.toThrow("Failed to fetch devices by user: 404");
    });
})