const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "");
const ACCESS_TOKEN_KEY = "stray_rescue_access_token";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export class AuthenticationError extends Error {
  readonly status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.status = status;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!API_BASE) {
    throw new Error("The API base URL is not configured.");
  }

  const body = new URLSearchParams({
    username: email,
    password,
  });

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new AuthenticationError(
      response.status === 401
        ? "The email or password is incorrect."
        : "Unable to sign in right now.",
      response.status,
    );
  }

  const data = (await response.json()) as Partial<LoginResponse>;
  if (!data.access_token || !data.token_type) {
    throw new Error("The login response did not include a valid access token.");
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  return {
    access_token: data.access_token,
    token_type: data.token_type,
  };
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
