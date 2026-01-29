// Mock API definition to avoid TS errors
export const api = {
    projects: {
        get: "projects:get",
        create: "projects:create",
        update: "projects:update",
        remove: "projects:remove",
        generateUploadUrl: "projects:generateUploadUrl"
    },
    messages: {
        get: "messages:get",
        create: "messages:create",
        markRead: "messages:markRead",
        remove: "messages:remove"
    }
} as any;
