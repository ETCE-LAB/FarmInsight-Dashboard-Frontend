class APIClient {
    async get(URL: string, header: { Authorization: string }, ignoreError: boolean = false) {
        try {
            const response = await fetch(URL, {
                headers: header,
            });

            if (!ignoreError && !response.ok) {
                throw new Error(`Network response not ok. Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to receive response: " + error);
        }
    }

    async post(URL: string, data: any, header: { Authorization: string }) {
        try {
            const response = await fetch(URL, {
                headers: {
                    ...header,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Network response not ok. Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to receive response: " + error);
        }
    }

    async put(URL: string, data: any, header: { Authorization: string }) {
        try {
            const response = await fetch(URL, {
                headers: {
                    ...header,
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Network response not ok. Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to receive response: " + error);
            throw error;
        }
    }

    async delete(URL: string, header: { Authorization: string }) {
        try {
            const response = await fetch(URL, {
                headers: {
                    ...header,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response;
        } catch (error) {
            console.error("Failed to receive Response: " + error);
        }
    }


}

export default APIClient;
