export interface AuditEntry {
    event_type: string;
    data: Record<string, any>;
}

/**
 * Insert an audit log entry without blocking user action
 * Uses sendBeacon for better reliability
 */
export const insertAuditLog = async (entry: AuditEntry) => {
    try {
        // Use sendBeacon for reliable delivery (better on page unload)
        const success = navigator.sendBeacon(
            '/api/log/insert',
            JSON.stringify(entry)
        );

        if (!success) {
            // Fallback to fetch if sendBeacon fails
            await fetch('/api/log/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry),
                keepalive: true,
            });
        }
    } catch (error) {
        console.warn('Error inserting audit log:', error);
    }
};