import Cookies from 'js-cookie';

// Use environment variable with fallback
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const accessToken = Cookies.get('accessToken');
    
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        // Log the response status and details
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function getFlights() {
    const response = await fetchWithAuth('/flights/');
    return response.json();
}

export async function addFlight(flightData: FormData) {
    console.log('Sending flight data:', Object.fromEntries(flightData.entries()));
    const response = await fetchWithAuth('/flights/', {
        method: 'POST',
        body: flightData,
    });
    return response.json();
} 