
export function http(url: string, data): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.timeout = 2000;
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) { return; }
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
            };
            xhr.onabort = () => {
                reject();
            };
            xhr.ontimeout = ()  => {
                reject();
            };
            xhr.onerror = () => {
                reject();
            };

            if (!(data === undefined || data === null)) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        } catch {
            reject();
        }
    });
}
