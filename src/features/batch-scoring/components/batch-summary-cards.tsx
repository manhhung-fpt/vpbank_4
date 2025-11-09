'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ThumbsUp
} from 'lucide-react';

interface BatchSummary {
  average_score: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  total_loan_amount: number;
  recommended_approvals: number;
}

interface BatchSummaryCardsProps {
  summary: BatchSummary;
}

export function BatchSummaryCards({ summary }: BatchSummaryCardsProps) {
  const totalApplications =
    summary.high_risk_count +
    summary.medium_risk_count +
    summary.low_risk_count;

  const approvalRate =
    totalApplications > 0
      ? ((summary.recommended_approvals / totalApplications) * 100).toFixed(1)
      : '0';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      description: 'Applications processed',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: summary.average_score.toFixed(0),
      description: 'Mean credit score',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'High Risk',
      value: summary.high_risk_count.toString(),
      description: `${((summary.high_risk_count / totalApplications) * 100).toFixed(1)}% of total`,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Medium Risk',
      value: summary.medium_risk_count.toString(),
      description: `${((summary.medium_risk_count / totalApplications) * 100).toFixed(1)}% of total`,
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      title: 'Low Risk',
      value: summary.low_risk_count.toString(),
      description: `${((summary.low_risk_count / totalApplications) * 100).toFixed(1)}% of total`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Loan Amount',
      value: formatCurrency(summary.total_loan_amount),
      description: 'Sum of all loan requests',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Recommended Approvals',
      value: summary.recommended_approvals.toString(),
      description: `${approvalRate}% approval rate`,
      icon: ThumbsUp,
      color: 'text-green-600'
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{card.value}</div>
            <p className='text-muted-foreground text-xs'>{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
