class APIClient {
    async get(URL: string, header: { Authorization: string }) {
        const response = await fetch(URL, {
            headers: header,
        });

        if (!response.ok) {
            try {
                return Promise.reject(JSON.stringify(await response.json()));
            } catch (e) {
                try {
                    return Promise.reject(await response.text());
                } catch (e) { // if the body is empty .text() fails too
                    console.dir(response);
                    return Promise.reject(`Network response not ok. Status: ${response.status}`);
                }
            }
        }
        return await response.json();
    }

    async post(URL: string, data: any, header: { Authorization: string }) {
        const response = await fetch(URL, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            try {
                return Promise.reject(JSON.stringify(await response.json()));
            } catch (e) {
                try {
                    return Promise.reject(await response.text());
                } catch (e) { // if the body is empty .text() fails too
                    console.dir(response);
                    return Promise.reject(`Network response not ok. Status: ${response.status}`);
                }
            }
        }

        return await response.json();
    }

    async put(URL: string, data: any, header: { Authorization: string }) {
        const response = await fetch(URL, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            try {
                return Promise.reject(JSON.stringify(await response.json()));
            } catch (e) {
                try {
                    return Promise.reject(await response.text());
                } catch (e) { // if the body is empty .text() fails too
                    console.dir(response);
                    return Promise.reject(`Network response not ok. Status: ${response.status}`);
                }
            }
        }

        return await response.json();
    }

    async delete(URL: string, header: { Authorization: string }) {
        const response = await fetch(URL, {
            headers: {
                ...header,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        if (!response.ok) {
            try {
                return Promise.reject(JSON.stringify(await response.json()));
            } catch (e) {
                try {
                    return Promise.reject(await response.text());
                } catch (e) { // if the body is empty .text() fails too
                    console.dir(response);
                    return Promise.reject(`Network response not ok. Status: ${response.status}`);
                }
            }
        }
        return response;
    }
}

export default APIClient;
