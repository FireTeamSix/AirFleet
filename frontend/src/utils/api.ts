import Cookies from 'js-cookie';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestData {
    [key: string]: string | number | boolean | null | undefined;
}

async function fetchWithAuth(url: string, method: RequestMethod = 'GET', body?: RequestData | FormData) {
    const accessToken = Cookies.get('accessToken');
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        if (body instanceof FormData) {
            // Remove Content-Type header for FormData to let browser set it
            delete headers['Content-Type'];
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
        // Try to refresh the token
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    Cookies.set('accessToken', data.access, { secure: true, sameSite: 'strict' });
                    
                    // Retry the original request with new token
                    headers['Authorization'] = `Bearer ${data.access}`;
                    return fetch(url, { ...options, headers });
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        }
        
        // If refresh failed or no refresh token, redirect to login
        window.location.href = '/login';
        return Promise.reject('Session expired');
    }

    return response;
}

export { fetchWithAuth }; 