export function NewId(): string {
    const timestamp = Math.round(new Date().getTime() / 1000).toString(16);
    let id = timestamp + 'xxxxxxxxxxxxxxxxxxx'
      .replace(/[x]/g, _ => Math.round(Math.random() * 16).toString(16))
      .substring(0, 16)
      .toLowerCase();

    return id;
  }
