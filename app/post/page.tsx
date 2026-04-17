import PostJobForm from '@/components/form/PostJobForm';

export default function PostJobPage() {
  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row">
        <div className="layui-col-md12">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-release"></i> 发布职位
            </div>
            <div className="layui-card-body">
              <blockquote className="layui-elem-quote layui-quote-nm">
                填写以下信息发布新职位，所有带 <span className="layui-badge-dot layui-bg-red"></span> 的为必填项
              </blockquote>
              <PostJobForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
