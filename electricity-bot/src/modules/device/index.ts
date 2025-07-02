import type {Static} from '@sinclair/typebox';
import {Type} from '@sinclair/typebox';
import {convertToType} from '../convertToType';

const endpointPrefix = '/device';

const DeviceRegisterResponseOkSchema = Type.Object({
    message: Type.String(),
});

const DeviceRegisterResponseErrorSchema = Type.Object({
    error: Type.String(),
});

const DeviceHistorySchema = Type.Object({
    history: Type.Array(
        Type.Object({
            timestamp: Type.String(),
            status: Type.Union([Type.Literal('ON'), Type.Literal('OFF'), Type.Literal('error')]),
        })
    )
});

const DeviceStatusSchema = Type.Object({
    status: Type.Union([Type.Literal('ON'), Type.Literal('OFF'), Type.Literal('error')]),
    lastChange: Type.String(),
});

const DeviceDeleteResponseSchema = Type.Object({});

const DeviceGetByUserResponseSchema = Type.Object({
    devices: Type.Array(
        Type.Object({
            uuid: Type.String(),
            name: Type.Optional(Type.String()),
            status: Type.Union([Type.Literal('ON'), Type.Literal('OFF'), Type.Literal('error')]),
            lastChange: Type.String(),
        })
    )
});

export type DeviceRegisterResponseOk = Static<typeof DeviceRegisterResponseOkSchema>;
export type DeviceRegisterResponseError = Static<typeof DeviceRegisterResponseErrorSchema>;
export type DeviceHistory = Static<typeof DeviceHistorySchema>;
export type DeviceStatus = Static<typeof DeviceStatusSchema>;
export type DeviceDelete = Static<typeof DeviceDeleteResponseSchema>;
export type DeviceGetByUserResponse = Static<typeof DeviceGetByUserResponseSchema>;

const requireAuthToken = (): string => {
    const token = localStorage.getItem('bot-session');
    if (!token) {
        throw new Error('Authentication token is required');
    }
    return token;
}

export const initDeviceModule = (fetchApi: typeof fetch) => {
    const registerDevice = async (uuid: string, name:string): Promise<DeviceRegisterResponseOk | DeviceRegisterResponseError> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const endpoint = `${endpointPrefix}/register`;

        const body = JSON.stringify({ uuid, name });

        const response = await fetchApi(endpoint, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            throw new Error(`Failed to register device: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return convertToType(data, Type.Union([DeviceRegisterResponseOkSchema, DeviceRegisterResponseErrorSchema]));
    };

    const getDeviceHistory = async (deviceId: string): Promise<DeviceHistory> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const query = `?uuid=${encodeURIComponent(deviceId)}`;
        const url = `${endpointPrefix}${query}`;

        const response = await fetchApi(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch device history: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return convertToType(data, DeviceHistorySchema);
    };

    const getDeviceStatus = async (deviceId: string): Promise<DeviceStatus> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const query = `?uuid=${encodeURIComponent(deviceId)}`;
        const url = `${endpointPrefix}/status${query}`;

        const response = await fetchApi(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch device status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return convertToType(data, DeviceStatusSchema);
    };

    const deleteDevice = async (deviceId: string): Promise<DeviceDelete> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const endpoint = `${endpointPrefix}/delete`;

        const body = JSON.stringify({ uuid: deviceId });

        const response = await fetchApi(endpoint, {
            method: 'DELETE',
            headers,
            body
        });

        if (!response.ok) {
            throw new Error(`Failed to delete device: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return convertToType(data, DeviceDeleteResponseSchema);
    }

    const getDevicesByUser = async (email: string): Promise<DeviceGetByUserResponse> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const query = `?email=${encodeURIComponent(email)}`;
        const url = `${endpointPrefix}${query}`;

        const response = await fetchApi(url, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch devices by user: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return convertToType(data, DeviceGetByUserResponseSchema);
    }

    return {
        registerDevice,
        getDeviceHistory,
        getDeviceStatus,
        deleteDevice,
        getDevicesByUser
    };
}
