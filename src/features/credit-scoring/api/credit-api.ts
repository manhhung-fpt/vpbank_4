/**
 * Credit Scoring API Client
 * Handles all API calls to the FastAPI backend
 */

import {
  CreditApplicationForm,
  CreditApplicationResponse,
  DemoScenario,
  CreditApplication
} from '../types/credit.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class CreditScoringAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Calculate credit score for an application
   */
  async calculateCreditScore(
    application: CreditApplicationForm
  ): Promise<CreditApplicationResponse> {
    const response = await fetch(`${this.baseUrl}/credit/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application)
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all available demo scenarios
   */
  async getDemoScenarios(): Promise<DemoScenario[]> {
    const response = await fetch(`${this.baseUrl}/demo/scenarios`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get specific demo scenario by name
   */
  async getDemoScenario(scenarioName: string): Promise<DemoScenario> {
    const response = await fetch(
      `${this.baseUrl}/demo/scenarios/${scenarioName}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Calculate score for a demo scenario
   */
  async scoreDemoScenario(
    scenarioName: string
  ): Promise<CreditApplicationResponse> {
    const response = await fetch(
      `${this.baseUrl}/demo/scenarios/${scenarioName}/score`,
      {
        method: 'POST'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get application by ID
   */
  async getApplication(
    applicationId: number
  ): Promise<CreditApplicationResponse> {
    const response = await fetch(
      `${this.baseUrl}/applications/${applicationId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * List all applications
   */
  async listApplications(
    skip: number = 0,
    limit: number = 10
  ): Promise<CreditApplication[]> {
    const response = await fetch(
      `${this.baseUrl}/applications?skip=${skip}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const creditScoringAPI = new CreditScoringAPI();
