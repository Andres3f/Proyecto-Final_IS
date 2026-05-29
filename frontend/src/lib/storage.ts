const KEY = "token";

// Permite elegir entre localStorage (persistente) y sessionStorage (solo sesión)
export const getToken = () => {
	return localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
};

export const setToken = (token: string, remember: boolean) => {
	if (remember) {
		localStorage.setItem(KEY, token);
		sessionStorage.removeItem(KEY);
	} else {
		sessionStorage.setItem(KEY, token);
		localStorage.removeItem(KEY);
	}
};

export const removeToken = () => {
	localStorage.removeItem(KEY);
	sessionStorage.removeItem(KEY);
};
