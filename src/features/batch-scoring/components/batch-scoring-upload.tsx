'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileDown
} from 'lucide-react';
import {
  uploadAndAnalyzeBatch,
  downloadSampleTemplate,
  exportBatchResults
} from '../api/batch-scoring.api';
import { BatchAnalysisResponse, FileUploadStatus } from '../types/batch.types';
import { BatchResultsTable } from './batch-results-table';
import { BatchSummaryCards } from './batch-summary-cards';

export function BatchScoringUpload() {
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>({
    file: null,
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [analysisResults, setAnalysisResults] =
    useState<BatchAnalysisResponse | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json'
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(csv|xlsx|xls|json)$/i)
      ) {
        setUploadStatus({
          file: null,
          status: 'error',
          progress: 0,
          message: 'Invalid file type. Please upload CSV, Excel, or JSON file.'
        });
        return;
      }

      setUploadStatus({
        file,
        status: 'idle',
        progress: 0,
        message: `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      });
      setAnalysisResults(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadStatus.file) return;

    setUploadStatus((prev) => ({
      ...prev,
      status: 'uploading',
      progress: 30,
      message: 'Uploading file...'
    }));

    try {
      setUploadStatus((prev) => ({
        ...prev,
        status: 'processing',
        progress: 60,
        message: 'Processing applications...'
      }));

      const results = await uploadAndAnalyzeBatch(uploadStatus.file);

      setUploadStatus((prev) => ({
        ...prev,
        status: 'success',
        progress: 100,
        message: `Successfully analyzed ${results.success} applications`
      }));

      setAnalysisResults(results);
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        status: 'error',
        progress: 0,
        message:
          error instanceof Error ? error.message : 'Failed to process file'
      }));
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadSampleTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'credit_application_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setUploadStatus({
        file: null,
        status: 'error',
        progress: 0,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to download template. Make sure the backend is running.'
      });
    }
  };

  const handleExportResults = async () => {
    if (analysisResults) {
      try {
        await exportBatchResults(analysisResults);
      } catch (error) {
        setUploadStatus((prev) => ({
          ...prev,
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to export results'
        }));
      }
    }
  };

  const handleReset = () => {
    setUploadStatus({
      file: null,
      status: 'idle',
      progress: 0,
      message: ''
    });
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Credit Scoring</CardTitle>
          <CardDescription>
            Upload a file containing multiple credit applications for batch
            analysis
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Download Template Button */}
          <div className='flex items-center justify-between border-b pb-4'>
            <div>
              <p className='text-sm font-medium'>Need a template?</p>
              <p className='text-muted-foreground text-xs'>
                Download our sample template with pre-filled examples
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDownloadTemplate}
            >
              <FileDown className='mr-2 h-4 w-4' />
              Download Template
            </Button>
          </div>

          {/* File Upload Area */}
          <div className='space-y-4'>
            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                uploadStatus.status === 'idle' || uploadStatus.file
                  ? 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  : 'border-muted-foreground/25'
              }`}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='.csv,.xlsx,.xls,.json'
                onChange={handleFileSelect}
                className='hidden'
                id='file-upload'
              />
              <label
                htmlFor='file-upload'
                className='flex cursor-pointer flex-col items-center space-y-2'
              >
                <FileSpreadsheet className='text-muted-foreground h-12 w-12' />
                <div>
                  <p className='text-sm font-medium'>
                    Click to upload or drag and drop
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    CSV, Excel (XLSX, XLS), or JSON files
                  </p>
                </div>
              </label>
            </div>

            {/* Status Messages */}
            {uploadStatus.message && (
              <Alert
                variant={
                  uploadStatus.status === 'error'
                    ? 'destructive'
                    : uploadStatus.status === 'success'
                      ? 'default'
                      : 'default'
                }
              >
                {uploadStatus.status === 'success' && (
                  <CheckCircle className='h-4 w-4' />
                )}
                {uploadStatus.status === 'error' && (
                  <AlertCircle className='h-4 w-4' />
                )}
                {(uploadStatus.status === 'uploading' ||
                  uploadStatus.status === 'processing') && (
                  <Loader2 className='h-4 w-4 animate-spin' />
                )}
                <AlertTitle>
                  {uploadStatus.status === 'success'
                    ? 'Success'
                    : uploadStatus.status === 'error'
                      ? 'Error'
                      : 'Processing'}
                </AlertTitle>
                <AlertDescription>{uploadStatus.message}</AlertDescription>
              </Alert>
            )}

            {/* Progress Bar */}
            {uploadStatus.status !== 'idle' &&
              uploadStatus.status !== 'error' &&
              uploadStatus.status !== 'success' && (
                <Progress value={uploadStatus.progress} className='w-full' />
              )}

            {/* Action Buttons */}
            <div className='flex gap-2'>
              <Button
                onClick={handleUpload}
                disabled={
                  !uploadStatus.file ||
                  uploadStatus.status === 'uploading' ||
                  uploadStatus.status === 'processing'
                }
                className='flex-1'
              >
                {uploadStatus.status === 'uploading' ||
                uploadStatus.status === 'processing' ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    Analyze Applications
                  </>
                )}
              </Button>
              {uploadStatus.file && (
                <Button variant='outline' onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResults && (
        <>
          {/* Summary Cards */}
          <BatchSummaryCards summary={analysisResults.summary} />

          {/* Results Table */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Detailed credit scores for all applications
                  </CardDescription>
                </div>
                <Button variant='outline' onClick={handleExportResults}>
                  <Download className='mr-2 h-4 w-4' />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BatchResultsTable results={analysisResults.results} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
