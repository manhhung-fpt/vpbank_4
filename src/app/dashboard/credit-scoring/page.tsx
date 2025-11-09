/**
 * Credit Scoring Page
 * Main page for AI-powered credit scoring system
 */
'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Brain } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';

import { CreditScoringForm } from '@/features/credit-scoring/components/credit-scoring-form';
import { CreditScoreDisplay } from '@/features/credit-scoring/components/credit-score-display';
import { KeyFactorsDisplay } from '@/features/credit-scoring/components/key-factors-display';
import { AIExplanationDisplay } from '@/features/credit-scoring/components/ai-explanation-display';
import { DemoScenarios } from '@/features/credit-scoring/components/demo-scenarios';

import {
  CreditApplicationForm,
  CreditApplicationResponse,
  DemoScenario
} from '@/features/credit-scoring/types/credit.types';
import { creditScoringAPI } from '@/features/credit-scoring/api/credit-api';

export default function CreditScoringPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreditApplicationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreditApplicationForm | undefined>();

  const handleSubmit = async (data: CreditApplicationForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await creditScoringAPI.calculateCreditScore(data);
      setResult(response);

      toast.success('Credit score calculated successfully!', {
        description: `Score: ${response.credit_score_result.credit_score}/850`
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to calculate credit score';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setFormData(scenario.data);
    setResult(null);
    setError(null);

    toast.info('Demo scenario loaded', {
      description: `${scenario.scenario_name} - Ready to calculate`
    });

    // Scroll to form
    setTimeout(() => {
      document.getElementById('form-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleScenarioScore = async (scenarioName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await creditScoringAPI.scoreDemoScenario(scenarioName);
      setResult(response);

      toast.success('Demo scenario scored!', {
        description: `${response.applicant_name}: ${response.credit_score_result.credit_score}/850`
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to score demo scenario';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className='w-full space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='flex items-center gap-2 text-3xl font-bold tracking-tight'>
              <Brain className='h-8 w-8' />
              AI Credit Scoring
            </h2>
            <p className='text-muted-foreground mt-2'>
              AI/ML Enhanced Credit Scoring System with XGBoost and OpenAI GPT
            </p>
          </div>
        </div>

        {/* Demo Scenarios */}
        <DemoScenarios
          onScenarioSelect={handleScenarioSelect}
          onScenarioScore={handleScenarioScore}
        />

        {/* Main Content */}
        <Tabs defaultValue='application' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='application'>Credit Application</TabsTrigger>
            {result && <TabsTrigger value='results'>Results</TabsTrigger>}
          </TabsList>

          {/* Application Form Tab */}
          <TabsContent
            value='application'
            className='space-y-4'
            id='form-section'
          >
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <CreditScoringForm
              onSubmit={handleSubmit}
              initialData={formData}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Results Tab */}
          {result && (
            <TabsContent
              value='results'
              className='space-y-6'
              id='results-section'
            >
              <Alert className='border-green-200 bg-green-50'>
                <CheckCircle2 className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-800'>
                  Credit score calculated successfully for{' '}
                  <strong>{result.applicant_name}</strong>
                </AlertDescription>
              </Alert>

              <div className='grid gap-6 md:grid-cols-2'>
                {/* Left Column - Score & Factors */}
                <div className='space-y-6'>
                  <CreditScoreDisplay result={result.credit_score_result} />
                  <KeyFactorsDisplay
                    factors={result.credit_score_result.key_factors}
                  />
                </div>

                {/* Right Column - AI Explanation */}
                <div>
                  <AIExplanationDisplay explanation={result.ai_explanation} />
                </div>
              </div>

              {/* Application Details */}
              <div className='grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Application ID
                  </p>
                  <p className='text-lg font-semibold'>
                    #{result.application_id}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Applicant</p>
                  <p className='text-lg font-semibold'>
                    {result.applicant_name}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Date</p>
                  <p className='text-lg font-semibold'>
                    {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Risk Level</p>
                  <p className='text-lg font-semibold'>
                    {result.credit_score_result.risk_category}
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageContainer>
  );
}
