'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BatchScoreResult } from '../types/batch.types';

interface BatchResultsTableProps {
  results: BatchScoreResult[];
}

export function BatchResultsTable({ results }: BatchResultsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(
    new Set()
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Credit Score</TableHead>
            <TableHead>Risk Category</TableHead>
            <TableHead>Approval Probability</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <React.Fragment key={result.application_id}>
              <TableRow>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => toggleRow(result.application_id)}
                    className='h-8 w-8 p-0'
                  >
                    {expandedRows.has(result.application_id) ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                  </Button>
                </TableCell>
                <TableCell className='font-medium'>{result.name}</TableCell>
                <TableCell>
                  <span
                    className={`font-bold ${getScoreColor(result.credit_score)}`}
                  >
                    {result.credit_score}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(result.risk_category)}>
                    {result.risk_category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(result.approval_probability * 100).toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      result.recommendation === 'Approve'
                        ? 'default'
                        : result.recommendation === 'Manual Review'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {result.recommendation}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRows.has(result.application_id) && (
                <TableRow>
                  <TableCell colSpan={6} className='bg-muted/50'>
                    <div className='space-y-2 p-4'>
                      <h4 className='text-sm font-semibold'>Key Factors:</h4>
                      <div className='grid gap-2 md:grid-cols-2'>
                        {result.key_factors.map((factor, index) => (
                          <div
                            key={index}
                            className='flex items-start gap-2 text-sm'
                          >
                            <div
                              className={`mt-0.5 h-2 w-2 rounded-full ${
                                factor.impact === 'positive'
                                  ? 'bg-green-500'
                                  : factor.impact === 'negative'
                                    ? 'bg-red-500'
                                    : 'bg-gray-500'
                              }`}
                            />
                            <div>
                              <span className='font-medium'>
                                {factor.factor}:
                              </span>{' '}
                              <span className='text-muted-foreground'>
                                {factor.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
