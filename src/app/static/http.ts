
export function http(url:string, data):Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 2000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (this.status == 200) {
                resolve(this.responseText);
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
        resolve();

    });
}