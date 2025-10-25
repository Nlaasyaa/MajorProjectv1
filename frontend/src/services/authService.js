// frontend/src/services/authService.js

import axios from 'axios';

const BACKEND_URL = 'http://localhost:3001/api/auth/me';

/**
 * Attempts to retrieve user data using a stored token.
 * @param {string} token - The JWT from localStorage
 */
export const getMe = async (token) => {
    const res = await axios.get(BACKEND_URL, {
        headers: {
            // Send the token in the Authorization header
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};