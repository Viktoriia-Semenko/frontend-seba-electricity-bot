import {initDeviceModule} from "../index";
import type {DeviceHistory} from "../index";

describe("GetDeviceHistory", () => {
    const mockedFetch = jest.fn().mockImplementation(() => {
        return new Response(JSON.stringify({
            history: [
                { timestamp: "2023-10-01T12:00:00Z", event: "Device started" },
                { timestamp: "2023-10-01T12:05:00Z", event: "Device stopped" }
            ]
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        })
    });

    const api = initDeviceModule(mockedFetch);

    it("should fetch device history successfully", async () => {
        const deviceId = "test-device-id";
        const expectedHistory: DeviceHistory = {
            history: [
                { timestamp: "2023-10-01T12:00:00Z", status: "ON" },
                { timestamp: "2023-10-01T12:05:00Z", status: "OFF" }
            ]
        };

        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(expectedHistory), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory(deviceId);
        expect(response).toEqual(expectedHistory);
    });

    it("should throw an error on network failure", async () => {
        mockedFetch.mockRejectedValueOnce(new Error("Network Error"));

        await expect(api.getDeviceHistory("test-device-id"))
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

        await expect(api.getDeviceHistory("test-device-id"))
            .rejects.toThrow("Failed to fetch device history: 404");
    });

    it("should handle empty history response", async () => {
        const deviceId = "test-device-id";
        const expectedHistory: DeviceHistory = { history: [] };

        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(expectedHistory), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory(deviceId);
        expect(response).toEqual(expectedHistory);
    });
    
    it("should handle response with different timestamp formats", async () => {
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ history: [{ timestamp: "2023-10-01T12:00:00Z", status: "ON" }, { timestamp: "2023-10-01 12:05:00", status: "OFF" }] }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory("test-device-id");
        expect(response.history.length).toBe(2);
        expect(response.history[0].timestamp).toBe("2023-10-01T12:00:00Z");
        expect(response.history[1].timestamp).toBe("2023-10-01 12:05:00");
    });

    it("should handle response with mixed status values", async () => {
        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ history: [{ timestamp: "2023-10-01T12:00:00Z", status: "ON" }, { timestamp: "2023-10-01T12:05:00Z", status: "OFF" }, { timestamp: "2023-10-01T12:10:00Z", status: "error" }] }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory("test-device-id");
        expect(response.history.length).toBe(3);
        expect(response.history[0].status).toBe("ON");
        expect(response.history[1].status).toBe("OFF");
        expect(response.history[2].status).toBe("error");
    });

    it("should handle response with large history data", async () => {
        const largeHistory = Array.from({ length: 1000 }, (_, i) => ({
            timestamp: `2023-10-01T12:${String(i).padStart(2, '0')}:00Z`,
            status: i % 2 === 0 ? "ON" : "OFF"
        }));

        mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ history: largeHistory }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }));

        const response = await api.getDeviceHistory("test-device-id");
        expect(response.history.length).toBe(1000);
        expect(response.history[0].status).toBe("ON");
        expect(response.history[999].status).toBe("OFF");
    });
})