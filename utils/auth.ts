// Secure authentication utility
// Uses server-side API instead of client-side environment variables

export interface AuthCredentials {
  username: string;
  password: string;
}

export const authenticateUser = async (
  credentials: AuthCredentials
): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log("Authentication successful");
      return true;
    } else {
      console.error("Authentication failed:", result.error);
      return false;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

// Example usage in admin component
export const loginAdmin = async (username: string, password: string) => {
  const isAuthenticated = await authenticateUser({ username, password });

  if (isAuthenticated) {
    // Store authentication state (e.g., in localStorage, cookies, or state)
    localStorage.setItem("adminAuthenticated", "true");
    localStorage.setItem("adminUsername", username);
    localStorage.setItem("loginTimestamp", Date.now().toString());
    return true;
  } else {
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminAuthenticated");
  localStorage.removeItem("adminUsername");
  localStorage.removeItem("loginTimestamp");
};

export const isAdminAuthenticated = (): boolean => {
  const authenticated = localStorage.getItem("adminAuthenticated");
  const loginTimestamp = localStorage.getItem("loginTimestamp");

  if (!authenticated || !loginTimestamp) {
    return false;
  }

  // Check if login is still valid (e.g., 2 weeks)
  const TWO_WEEKS = 7 * 24 * 60 * 60 * 1000;
  const isValid = Date.now() - parseInt(loginTimestamp, 10) < TWO_WEEKS;

  if (!isValid) {
    logoutAdmin();
    return false;
  }

  return true;
};
