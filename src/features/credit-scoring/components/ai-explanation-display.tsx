/**
 * AI Explanation Display Component
 * Shows AI-generated explanation and recommendations
 */
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Lightbulb, Brain } from 'lucide-react';
import { AIExplanation } from '../types/credit.types';

interface AIExplanationDisplayProps {
  explanation: AIExplanation;
}

export function AIExplanationDisplay({
  explanation
}: AIExplanationDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Brain className='h-5 w-5' />
          AI Analysis
        </CardTitle>
        <p className='text-muted-foreground text-sm'>{explanation.summary}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='strengths' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='strengths'>Strengths</TabsTrigger>
            <TabsTrigger value='concerns'>Concerns</TabsTrigger>
            <TabsTrigger value='recommendations'>Recommendations</TabsTrigger>
          </TabsList>

          {/* Strengths Tab */}
          <TabsContent value='strengths' className='mt-4 space-y-3'>
            {explanation.strengths.length > 0 ? (
              explanation.strengths.map((strength, index) => (
                <Alert key={index} className='border-green-200 bg-green-50'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <AlertDescription className='ml-2 text-sm'>
                    {strength}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No specific strengths identified
              </p>
            )}
          </TabsContent>

          {/* Concerns Tab */}
          <TabsContent value='concerns' className='mt-4 space-y-3'>
            {explanation.concerns.length > 0 ? (
              explanation.concerns.map((concern, index) => (
                <Alert key={index} className='border-yellow-200 bg-yellow-50'>
                  <AlertCircle className='h-4 w-4 text-yellow-600' />
                  <AlertDescription className='ml-2 text-sm'>
                    {concern}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No significant concerns identified
              </p>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value='recommendations' className='mt-4 space-y-3'>
            {explanation.recommendations.length > 0 ? (
              explanation.recommendations.map((recommendation, index) => (
                <Alert key={index} className='border-blue-200 bg-blue-50'>
                  <Lightbulb className='h-4 w-4 text-blue-600' />
                  <AlertDescription className='ml-2 text-sm'>
                    {recommendation}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No specific recommendations available
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Detailed Analysis */}
        {explanation.detailed_analysis && (
          <div className='mt-6 border-t pt-6'>
            <h4 className='mb-2 text-sm font-medium'>Detailed Analysis</h4>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {explanation.detailed_analysis}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
