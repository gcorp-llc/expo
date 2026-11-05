export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => Promise<void> | void;
  timeoutMs?: number;
  mockMode?: boolean;
}

export class SharedApiClient {
  private baseUrl: string;
  private getToken?: () => Promise<string | null> | string | null;
  private onUnauthorized?: () => Promise<void> | void;
  private timeoutMs: number;
  private mockMode: boolean;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getToken = config.getToken;
    this.onUnauthorized = config.onUnauthorized;
    this.timeoutMs = config.timeoutMs ?? 15000;
    this.mockMode = config.mockMode ?? false;
  }

  setMockMode(enabled: boolean) {
    this.mockMode = enabled;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 2
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken ? await this.getToken() : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 401) {
        if (this.onUnauthorized) {
          await this.onUnauthorized();
        }
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timer);
      if (retries > 0 && !controller.signal.aborted) {
        return this.request<T>(endpoint, options, retries - 1);
      }
      throw err;
    }
  }
}
