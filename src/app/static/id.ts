export function NewId(): string {
    const timestamp = (new Date().getTime() / 1000).toString(16);
    const oid = timestamp + 'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, _ => (Math.random() * 16).toString(16))
      .toLowerCase();

    return oid;
  }
