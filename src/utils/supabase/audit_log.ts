interface AuditEntry {
    event_type: string;
    data: Record<string, any>;
}

export const insertAuditLog = async (entry: AuditEntry) => {
    try {
        const resp = await fetch('/api/log/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });
        if (!resp.ok) {
            throw new Error('Failed to insert audit log');
        }
    } catch (error) {
        console.error('Error inserting audit log:', error);
    }
};