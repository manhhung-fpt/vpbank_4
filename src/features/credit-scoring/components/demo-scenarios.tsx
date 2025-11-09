/**
 * Demo Scenarios Selector Component
 * Allows users to quickly test with pre-configured scenarios
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Users, Briefcase, UserPlus } from 'lucide-react';
import { DemoScenario } from '../types/credit.types';
import { creditScoringAPI } from '../api/credit-api';
import { formatCurrency } from '../utils/format';

interface DemoScenariosProps {
  onScenarioSelect: (scenario: DemoScenario) => void;
  onScenarioScore: (scenarioName: string) => Promise<void>;
}

export function DemoScenarios({
  onScenarioSelect,
  onScenarioScore
}: DemoScenariosProps) {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringScenario, setScoringScenario] = useState<string | null>(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const data = await creditScoringAPI.getDemoScenarios();
      setScenarios(data);
    } catch (error) {
      // Failed to load scenarios
    } finally {
      setLoading(false);
    }
  };

  const handleScore = async (scenarioName: string) => {
    try {
      setScoringScenario(scenarioName);
      await onScenarioScore(scenarioName);
    } finally {
      setScoringScenario(null);
    }
  };

  const getScenarioIcon = (name: string) => {
    if (name.toLowerCase().includes('salaried'))
      return <Briefcase className='h-5 w-5' />;
    if (name.toLowerCase().includes('freelancer'))
      return <Users className='h-5 w-5' />;
    if (name.toLowerCase().includes('new'))
      return <UserPlus className='h-5 w-5' />;
    return <Users className='h-5 w-5' />;
  };

  const getScenarioBadge = (name: string) => {
    if (name.toLowerCase().includes('salaried'))
      return <Badge className='bg-green-100 text-green-700'>~780 Score</Badge>;
    if (name.toLowerCase().includes('freelancer'))
      return <Badge className='bg-blue-100 text-blue-700'>~625 Score</Badge>;
    if (name.toLowerCase().includes('new'))
      return (
        <Badge className='bg-yellow-100 text-yellow-700'>~450 Score</Badge>
      );
    return <Badge>Test</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>Demo Scenarios</h3>
          <p className='text-muted-foreground text-sm'>
            Try pre-configured test cases to see how the AI scoring works
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {scenarios.map((scenario) => (
          <Card
            key={scenario.scenario_name}
            className='transition-shadow hover:shadow-md'
          >
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {getScenarioIcon(scenario.scenario_name)}
                  <CardTitle className='text-base'>
                    {scenario.scenario_name.split(' - ')[0]}
                  </CardTitle>
                </div>
                {getScenarioBadge(scenario.scenario_name)}
              </div>
              <CardDescription className='line-clamp-2 text-xs'>
                {scenario.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='space-y-1 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Name:</span>
                  <span className='font-medium'>{scenario.data.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Age:</span>
                  <span className='font-medium'>{scenario.data.age} years</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Income:</span>
                  <span className='font-medium'>
                    {formatCurrency(scenario.data.annual_income)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Loan:</span>
                  <span className='font-medium'>
                    {formatCurrency(scenario.data.loan_amount)}
                  </span>
                </div>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={() => onScenarioSelect(scenario)}
                >
                  Load Form
                </Button>
                <Button
                  size='sm'
                  className='flex-1'
                  onClick={() =>
                    handleScore(
                      scenario.scenario_name.toLowerCase().split(' ')[0]
                    )
                  }
                  disabled={scoringScenario !== null}
                >
                  {scoringScenario ===
                  scenario.scenario_name.toLowerCase().split(' ')[0] ? (
                    <>
                      <Loader2 className='mr-2 h-3 w-3 animate-spin' />
                      Scoring...
                    </>
                  ) : (
                    <>
                      <Play className='mr-2 h-3 w-3' />
                      Score Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
