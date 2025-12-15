interface AuditParams {
    actorId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    payload?: any;
}
export declare function createAuditLog({ actorId, action, entity, entityId, payload, }: AuditParams): Promise<any>;
export {};
//# sourceMappingURL=createAuditLog.d.ts.map