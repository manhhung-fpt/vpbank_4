/**
 * Credit Score Display Component
 * Shows the credit score with visual gauge and details
 */
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditScoreResult } from '../types/credit.types';
import {
  formatPercentage,
  getScoreColor,
  getScoreBgColor,
  getRiskColor,
  getRiskIcon,
  getApprovalText,
  getScorePercentage
} from '../utils/format';

interface CreditScoreDisplayProps {
  result: CreditScoreResult;
}

export function CreditScoreDisplay({ result }: CreditScoreDisplayProps) {
  const scorePercentage = getScorePercentage(result.credit_score);

  return (
    <div className='space-y-6'>
      {/* Main Score Card */}
      <Card className={`${getScoreBgColor(result.credit_score)} border-2`}>
        <CardHeader className='text-center'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>
            Credit Score
          </CardTitle>
          <div
            className={`text-6xl font-bold ${getScoreColor(result.credit_score)}`}
          >
            {result.credit_score}
          </div>
          <CardDescription className='text-lg'>out of 850</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Score Range Progress */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Poor</span>
              <span className='text-muted-foreground'>Excellent</span>
            </div>
            <Progress value={scorePercentage} className='h-3' />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>300</span>
              <span>850</span>
            </div>
          </div>

          {/* Risk Category */}
          <div className='flex items-center justify-between border-t pt-4'>
            <span className='text-sm font-medium'>Risk Category</span>
            <Badge
              className={`${getRiskColor(result.risk_category)} px-3 py-1 text-sm`}
            >
              {getRiskIcon(result.risk_category)} {result.risk_category}
            </Badge>
          </div>

          {/* Approval Probability */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Approval Probability</span>
              <span className='text-sm font-bold'>
                {formatPercentage(result.approval_probability)}
              </span>
            </div>
            <Progress
              value={result.approval_probability * 100}
              className='h-2'
            />
            <p className='text-muted-foreground text-center text-xs'>
              {getApprovalText(result.approval_probability)} chance of approval
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Card */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            {result.recommendation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
