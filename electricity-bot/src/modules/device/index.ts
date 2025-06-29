import type {Static} from '@sinclair/typebox';
import {Type} from '@sinclair/typebox';
import {convertToType} from '../convertToType';

const endpointPrefix = '/api/device';

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

export type DeviceRegisterResponseOk = Static<typeof DeviceRegisterResponseOkSchema>;
export type DeviceRegisterResponseError = Static<typeof DeviceRegisterResponseErrorSchema>;
export type DeviceHistory = Static<typeof DeviceHistorySchema>;
export type DeviceStatus = Static<typeof DeviceStatusSchema>;
export type DeviceDelete = Static<typeof DeviceDeleteResponseSchema>;

export const initDeviceModule = (fetchApi: typeof fetch) => {
    const registerDevice = async (uuid: string): Promise<DeviceRegisterResponseOk | DeviceRegisterResponseError> => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');

        const endpoint = `${endpointPrefix}/register`;

        const body = JSON.stringify({ uuid });

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
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('cache-control', 'no-cache');

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

    return {
        registerDevice,
        getDeviceHistory,
        getDeviceStatus,
        deleteDevice
    };
}
