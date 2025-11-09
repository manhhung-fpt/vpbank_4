'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Calculator } from 'lucide-react';
import {
  creditApplicationSchema,
  CreditApplicationFormData
} from '../utils/validation';
import { CreditApplicationForm, EmploymentType } from '../types/credit.types';

interface CreditScoringFormProps {
  onSubmit: (data: CreditApplicationForm) => Promise<void>;
  initialData?: CreditApplicationForm;
  isLoading?: boolean;
}

export function CreditScoringForm({
  onSubmit,
  initialData,
  isLoading = false
}: CreditScoringFormProps) {
  const form = useForm<CreditApplicationFormData>({
    resolver: zodResolver(creditApplicationSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      age: 25,
      employment_type: 'Salaried',
      annual_income: 0,
      years_employed: 0,
      existing_loans: 0,
      credit_history_length: 0,
      has_bank_account: true,
      monthly_expenses: 0,
      loan_amount: 0,
      loan_purpose: ''
    }
  });

  // Update form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CreditApplicationFormData) => {
    await onSubmit(data as CreditApplicationForm);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the applicant</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Nguyễn Văn A' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='email@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder='+84 123 456 789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='age'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>
              Current employment status and income
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='employment_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select employment type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(EmploymentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='years_employed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years Employed *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='annual_income'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Annual Income (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='800,000,000'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter annual income in Vietnamese Dong
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Current financial situation</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='existing_loans'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Existing Loans *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='credit_history_length'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit History (months) *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    How long have you had credit accounts?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='monthly_expenses'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Expenses (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='25,000,000'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='has_bank_account'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>I have an active bank account</FormLabel>
                    <FormDescription>
                      Check if you have a bank account relationship
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Loan Request */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Request</CardTitle>
            <CardDescription>
              Details about the loan you are requesting
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <FormField
              control={form.control}
              name='loan_amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='200,000,000'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>Amount you wish to borrow</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='loan_purpose'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Home improvement, Business, Education, etc.'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you use the loan for?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Alternative Data - Social Media & E-commerce */}
        <Card>
          <CardHeader>
            <CardTitle>📱 Alternative Data (Optional)</CardTitle>
            <CardDescription>
              Social media and e-commerce activity can improve your credit score
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Social Media Section */}
            <div className='space-y-4'>
              <h4 className='text-primary text-sm font-semibold'>
                Social Media Presence
              </h4>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='social_media_months'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Months Active on Social Media</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='60'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        How long you have been active (months)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='social_connections'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Connections/Followers</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='500'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Total connections across platforms
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='social_activity_level'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Activity Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select activity level' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='None'>None</SelectItem>
                          <SelectItem value='Low'>Low</SelectItem>
                          <SelectItem value='Medium'>Medium</SelectItem>
                          <SelectItem value='High'>High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How active are you on social media?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='verified_social_accounts'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verified Social Accounts</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='2'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Number of verified accounts (0-10)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* E-commerce Section */}
            <div className='space-y-4 border-t pt-4'>
              <h4 className='text-primary text-sm font-semibold'>
                E-commerce Activity
              </h4>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='ecommerce_years'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Using E-commerce</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='5'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Years shopping online (Shopee, Lazada, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='monthly_transactions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Transactions</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='10'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Average online purchases per month
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='avg_transaction_value'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Transaction Value (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1500000'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Average value per transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='transaction_success_rate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Success Rate</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          min='0'
                          max='1'
                          placeholder='0.98'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Success rate (0.0 - 1.0, e.g., 0.98 = 98%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='uses_digital_wallet'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Digital Wallet User</FormLabel>
                        <FormDescription>
                          Use Momo, ZaloPay, ShopeePay, etc.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset Form
          </Button>
          <Button type='submit' disabled={isLoading} className='min-w-[200px]'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Calculating Score...
              </>
            ) : (
              <>
                <Calculator className='mr-2 h-4 w-4' />
                Calculate Credit Score
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
