import CompanyVerifyForm from '@/components/form/CompanyVerifyForm';

export default function EmployerCompanyPage() {
  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row">
        <div className="layui-col-md12">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-ok-circle"></i> 企业认证
            </div>
            <div className="layui-card-body">
              <blockquote className="layui-elem-quote layui-quote-nm">
                完成企业认证后，您的职位将获得更高曝光率，同时提升企业信誉度
              </blockquote>
              <CompanyVerifyForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
