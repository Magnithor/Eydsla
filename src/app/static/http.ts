
export function http(url:string, data):Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.timeout = 2000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        }

        xhr.onerror = () => {
            reject();
        }

        if (!(data === undefined || data === null)) 
        {
            xhr.send(data)
        } else {
            xhr.send();
        }
    });
}