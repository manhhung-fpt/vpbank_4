/**
 * Key Factors Display Component
 * Shows factors affecting the credit score
 */
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KeyFactor } from '../types/credit.types';
import { getImpactColor, getImpactIcon } from '../utils/format';

interface KeyFactorsDisplayProps {
  factors: KeyFactor[];
}

export function KeyFactorsDisplay({ factors }: KeyFactorsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Key Factors</CardTitle>
        <p className='text-muted-foreground text-sm'>
          Factors that influenced your credit score
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
        {factors.map((factor, index) => (
          <div
            key={index}
            className='space-y-2 border-b pb-4 last:border-b-0 last:pb-0'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='text-sm font-medium'>{factor.factor}</h4>
                  <Badge
                    variant={
                      factor.impact === 'Positive' ? 'default' : 'destructive'
                    }
                    className='text-xs'
                  >
                    {getImpactIcon(factor.impact)} {factor.impact}
                  </Badge>
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {factor.description}
                </p>
              </div>
              <span
                className={`ml-4 text-sm font-bold ${getImpactColor(factor.impact)}`}
              >
                {factor.score.toFixed(0)}/100
              </span>
            </div>
            <Progress
              value={factor.score}
              className={`h-2 ${
                factor.impact === 'Positive' ? 'bg-green-100' : 'bg-red-100'
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
