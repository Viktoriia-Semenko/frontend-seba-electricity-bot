import type {Static} from '@sinclair/typebox';
import {Type} from '@sinclair/typebox';
import {convertToType} from '../convertToType';
import {SESSION_KEY} from "../../constants/session";
import { API_ROUTES } from '../../constants/apiRoutes';

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
    lastChange:  Type.Union([Type.String(), Type.Null()]),
});

const DeviceDeleteResponseSchema = Type.Object({});

const DeviceGetByUserResponseSchema = Type.Object({
    devices: Type.Array(
        Type.Object({
            uuid: Type.String(),
            name: Type.Optional(Type.String()),
            status: Type.Union([Type.Literal('ON'), Type.Literal('OFF'), Type.Literal('error')]),
            lastChange:  Type.Union([Type.String(), Type.Null()]),
        })
    )
});

export type DeviceHistory = Static<typeof DeviceHistorySchema>;
export type DeviceStatus = Static<typeof DeviceStatusSchema>;
export type DeviceDelete = Static<typeof DeviceDeleteResponseSchema>;
export type DeviceGetByUserResponse = Static<typeof DeviceGetByUserResponseSchema>;

const requireAuthToken = (): string => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) {
        throw new Error('Authentication token is required');
    }
    return token;
}

export const initDeviceModule = (fetchApi: typeof fetch) => {

    const getDeviceHistory = async (deviceId: string): Promise<DeviceHistory> => {
        const token = requireAuthToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');
        headers.append('Authorization', `Bearer ${token}`);

        const query = `${API_ROUTES.DEVICES.BASE}?uuid=${encodeURIComponent(deviceId)}`;
        const url = `${query}`;

        const response = await fetchApi(url, {
            method: 'GET',
            headers
        });

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

        const query = `${encodeURIComponent(deviceId)}`;
        const url = `${API_ROUTES.DEVICES.STATUS}${query}`;

        const response = await fetchApi(url, {
            method: 'GET',
            headers
        });

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

        const query = `${API_ROUTES.DEVICES.DELETE}/${encodeURIComponent(deviceId)}`;

        const response = await fetchApi(query, {
            method: 'DELETE',
            headers
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

        const query = `${API_ROUTES.DEVICES.BASE}?email=${encodeURIComponent(email)}`;
        const url = `${query}`;

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
        getDeviceHistory,
        getDeviceStatus,
        deleteDevice,
        getDevicesByUser
    };
}
