import PageContainer from '@/components/layout/page-container';
import { BatchScoringUpload } from '@/features/batch-scoring/components/batch-scoring-upload';

export default function BatchScoringPage() {
  return (
    <PageContainer scrollable>
      <div className='w-full space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Batch Credit Scoring
            </h2>
            <p className='text-muted-foreground'>
              Upload and analyze multiple credit applications at once
            </p>
          </div>
        </div>
        <BatchScoringUpload />
      </div>
    </PageContainer>
  );
}
