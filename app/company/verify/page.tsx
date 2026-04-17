import CompanyVerifyForm from '@/components/form/CompanyVerifyForm';

export default function CompanyVerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">企业认证</h1>
          <p className="text-gray-600 mt-1">完成企业认证后，您的职位将获得更高曝光率</p>
        </div>

        <CompanyVerifyForm />
      </div>
    </div>
  );
}
