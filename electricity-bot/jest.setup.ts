let storageMock: Record<string, string> = {};

Object.defineProperty(global, 'localStorage', {
    value: {
        getItem: (key: string) => storageMock[key] || null,
        setItem: (key: string, value: string) => { storageMock[key] = value; },
        removeItem: (key: string) => { delete storageMock[key]; },
        clear: () => { storageMock = {}; },
    },
    writable: true,
});