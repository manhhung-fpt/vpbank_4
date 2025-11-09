/**
 * API functions for Batch Credit Scoring
 */

import { BatchAnalysisResponse } from '../types/batch.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function uploadAndAnalyzeBatch(
  file: File
): Promise<BatchAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/credit/batch-score`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to analyze batch: ${response.statusText}`
    );
  }

  return response.json();
}

export async function downloadSampleTemplate(): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/credit/batch-template`, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error('Failed to download sample template');
  }

  return response.blob();
}

export async function exportBatchResults(
  results: BatchAnalysisResponse
): Promise<void> {
  const csvContent = convertToCSV(results);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `batch_analysis_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data: BatchAnalysisResponse): string {
  const headers = [
    'Name',
    'Credit Score',
    'Risk Category',
    'Approval Probability',
    'Recommendation'
  ];

  const rows = data.results.map((result) => [
    result.name,
    result.credit_score,
    result.risk_category,
    `${(result.approval_probability * 100).toFixed(2)}%`,
    result.recommendation
  ]);

  const csvRows = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
  ];

  return csvRows.join('\n');
}
