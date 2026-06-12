import { notFound } from 'next/navigation';
import { jobService, companyService } from '@/lib/services/data';
import JobDetail from '@/components/job/JobDetail';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await jobService.getById(id);

  if (!job) {
    notFound();
  }

  const company = await companyService.getById(job.companyId);

  return (
    <div className="layui-container layui-mt20">
      <JobDetail
        job={job}
        companyName={company?.name}
        companyLogo={company?.logo}
        companyDescription={company?.description}
        companyLocation={company?.location ? `${company.location}, ${company.state}` : undefined}
        companyVerified={company?.verified}
      />
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  const jobs = await jobService.getAll();
  return jobs.slice(0, 10).map((job) => ({
    id: job.id,
  }));
}
