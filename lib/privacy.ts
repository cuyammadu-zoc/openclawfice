export interface OwnedRecord {
  userId?: string;
}

export function belongsToUser(record: OwnedRecord, userId: string): boolean {
  return record.userId === userId;
}

export function scopeToUser<T extends OwnedRecord>(records: T[], userId: string): T[] {
  return records.filter(record => belongsToUser(record, userId));
}