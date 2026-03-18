const BASE_URL = process.env.KARRITO_API_URL ?? 'https://karrito.shop';

interface ApiOptions {
  apiKey?: string;
  timeout?: number;
}

interface ApiError {
  error: string;
}

export class KarritoApiClient {
  private baseUrl: string;
  private apiKey: string | undefined;
  private timeout: number;

  constructor(options: ApiOptions = {}) {
    this.baseUrl = BASE_URL;
    this.apiKey = options.apiKey ?? process.env.KARRITO_API_KEY;
    this.timeout = options.timeout ?? 10_000;
  }

  get hasApiKey(): boolean {
    return Boolean(this.apiKey);
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'karrito-mcp/2.0.0',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: response.statusText,
        }));
        throw new Error(
          `Karrito API error ${response.status}: ${(error as ApiError).error}`
        );
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // --- Public endpoints (no auth) ---

  async searchCatalogs(query?: string): Promise<unknown> {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/api/v1/stores${params}`);
  }

  async checkSlug(slug: string): Promise<{ available: boolean }> {
    return this.request<{ available: boolean }>(
      `/api/check-slug?slug=${encodeURIComponent(slug)}`
    );
  }

  // --- Products ---

  async listProducts(limit = 50, offset = 0): Promise<unknown> {
    return this.request(`/api/v1/products?limit=${limit}&offset=${offset}`);
  }

  async getProduct(id: string): Promise<unknown> {
    return this.request(`/api/v1/products/${id}`);
  }

  async createProduct(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Record<string, unknown>): Promise<unknown> {
    return this.request(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<unknown> {
    return this.request(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Categories ---

  async listCategories(limit = 50, offset = 0): Promise<unknown> {
    return this.request(`/api/v1/categories?limit=${limit}&offset=${offset}`);
  }

  async createCategory(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/api/v1/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Record<string, unknown>): Promise<unknown> {
    return this.request(`/api/v1/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<unknown> {
    return this.request(`/api/v1/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Orders ---

  async listOrders(
    limit = 50,
    offset = 0,
    status?: string
  ): Promise<unknown> {
    const statusParam = status ? `&status=${status}` : '';
    return this.request(
      `/api/v1/orders?limit=${limit}&offset=${offset}${statusParam}`
    );
  }

  async getOrder(id: string): Promise<unknown> {
    return this.request(`/api/v1/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string): Promise<unknown> {
    return this.request(`/api/v1/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // --- Store ---

  async getStore(): Promise<unknown> {
    return this.request('/api/v1/store');
  }

  async updateStore(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/api/v1/store', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Discounts ---

  async listDiscounts(limit = 50, offset = 0): Promise<unknown> {
    return this.request(`/api/v1/discounts?limit=${limit}&offset=${offset}`);
  }

  async createDiscount(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/api/v1/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscount(id: string, data: Record<string, unknown>): Promise<unknown> {
    return this.request(`/api/v1/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscount(id: string): Promise<unknown> {
    return this.request(`/api/v1/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Reviews ---

  async listReviews(limit = 50, offset = 0, status?: string): Promise<unknown> {
    const statusParam = status ? `&status=${status}` : '';
    return this.request(
      `/api/v1/reviews?limit=${limit}&offset=${offset}${statusParam}`
    );
  }

  async moderateReview(id: string, status: string): Promise<unknown> {
    return this.request(`/api/v1/reviews/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteReview(id: string): Promise<unknown> {
    return this.request(`/api/v1/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Customers ---

  async listCustomers(limit = 50, offset = 0): Promise<unknown> {
    return this.request(`/api/v1/customers?limit=${limit}&offset=${offset}`);
  }

  async getCustomer(id: string): Promise<unknown> {
    return this.request(`/api/v1/customers/${id}`);
  }

  // --- Stats ---

  async getStats(): Promise<unknown> {
    return this.request('/api/v1/stats');
  }

  // --- Shipping ---

  async listShipping(): Promise<unknown> {
    return this.request('/api/v1/shipping');
  }

  async createShipping(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/api/v1/shipping', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateShipping(id: string, data: Record<string, unknown>): Promise<unknown> {
    return this.request(`/api/v1/shipping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteShipping(id: string): Promise<unknown> {
    return this.request(`/api/v1/shipping/${id}`, {
      method: 'DELETE',
    });
  }
}
