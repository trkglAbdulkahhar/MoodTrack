import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@panas_users';
const CURRENT_USER_KEY = '@panas_current_user';

// Helper to generate a unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const registerUser = async (name, email, password) => {
    try {
        const usersStr = await AsyncStorage.getItem(USERS_KEY);
        const users = usersStr ? JSON.parse(usersStr) : [];

        // Check if email exists
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("User with this email already exists");
        }

        const newUser = {
            id: generateId(),
            name,
            email,
            password, // Stored in plain text for this local prototype
            age: null,
            gender: "",
            occupation: "",
            bio: ""
        };

        users.push(newUser);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Automatically log them in
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

        return newUser;
    } catch (e) {
        throw e;
    }
};

export const loginUser = async (email, password) => {
    try {
        const usersStr = await AsyncStorage.getItem(USERS_KEY);
        const users = usersStr ? JSON.parse(usersStr) : [];

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    } catch (e) {
        throw e;
    }
};

export const getCurrentUser = async () => {
    try {
        const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to fetch current user", e);
        return null;
    }
};

export const logoutUser = async () => {
    try {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
        console.error("Failed to logout", e);
    }
};

export const updateUserProfile = async (newData) => {
    try {
        const currentUserStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (!currentUserStr) throw new Error("No active user session");

        let currentUser = JSON.parse(currentUserStr);
        // Merge the objects
        const updatedUser = { ...currentUser, ...newData };

        // Save back to session
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

        // Save back to global users array to persist across sessions
        const usersStr = await AsyncStorage.getItem(USERS_KEY);
        let users = usersStr ? JSON.parse(usersStr) : [];
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        }

        return updatedUser;
    } catch (e) {
        throw e;
    }
};
