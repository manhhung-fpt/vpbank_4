/**
 * Credit Scoring Utility Functions
 */

import { RiskCategory } from '../types/credit.types';

/**
 * Format currency in VND
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Get color for credit score
 */
export function getScoreColor(score: number): string {
  if (score >= 750) return 'text-green-600';
  if (score >= 650) return 'text-blue-600';
  if (score >= 550) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get background color for credit score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 750) return 'bg-green-50 border-green-200';
  if (score >= 650) return 'bg-blue-50 border-blue-200';
  if (score >= 550) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

/**
 * Get color for risk category
 */
export function getRiskColor(risk: RiskCategory): string {
  switch (risk) {
    case RiskCategory.LOW:
      return 'text-green-700 bg-green-100 border-green-300';
    case RiskCategory.MEDIUM:
      return 'text-blue-700 bg-blue-100 border-blue-300';
    case RiskCategory.HIGH:
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case RiskCategory.VERY_HIGH:
      return 'text-red-700 bg-red-100 border-red-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

/**
 * Get icon for risk category
 */
export function getRiskIcon(risk: RiskCategory): string {
  switch (risk) {
    case RiskCategory.LOW:
      return '✓';
    case RiskCategory.MEDIUM:
      return '○';
    case RiskCategory.HIGH:
      return '△';
    case RiskCategory.VERY_HIGH:
      return '✕';
    default:
      return '?';
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Get approval probability text
 */
export function getApprovalText(probability: number): string {
  if (probability >= 0.8) return 'Very High';
  if (probability >= 0.6) return 'High';
  if (probability >= 0.4) return 'Moderate';
  if (probability >= 0.2) return 'Low';
  return 'Very Low';
}

/**
 * Calculate score percentage for progress bar
 */
export function getScorePercentage(score: number): number {
  return ((score - 300) / (850 - 300)) * 100;
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Get impact color
 */
export function getImpactColor(impact: 'Positive' | 'Negative'): string {
  return impact === 'Positive' ? 'text-green-600' : 'text-red-600';
}

/**
 * Get impact icon
 */
export function getImpactIcon(impact: 'Positive' | 'Negative'): string {
  return impact === 'Positive' ? '↑' : '↓';
}
