'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS, SALARY_TYPE_OPTIONS } from '@/lib/constants';
import { categoryService, locationService } from '@/lib/utils/data';

const PostJobForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const categories = categoryService.getAllSubcategories();
  const locations = locationService.getAll();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    alert('职位发布成功！');
    router.push('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 表单头部 */}
      <div className="layui-card mb-6">
        <div className="layui-card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">发布新职位</h1>
              <p className="text-gray-600">填写职位信息，吸引优秀人才</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  带 * 为必填项
                </span>
              </div>
            </div>
          </div>

          {/* 步骤指示器 */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    formStep >= step
                      ? 'bg-[var(--layui-primary)] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {formStep > step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      formStep > step ? 'bg-[var(--layui-primary)]' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="layui-card">
        <div className="layui-card-body">
          {/* 第一步：基本信息 */}
          {formStep === 1 && (
            <div className="layui-anim layui-anim-fadein">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--layui-primary)] text-white flex items-center justify-center text-sm">1</span>
                基本信息
              </h3>

              <div className="space-y-5">
                <div className="layui-form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="例如：高级前端工程师"
                    className="layui-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="layui-form-item">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      职位分类 <span className="text-red-500">*</span>
                    </label>
                    <select name="category" className="layui-select" required>
                      <option value="">请选择分类</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="layui-form-item">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      工作地点 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select name="state" className="layui-select w-1/3" required>
                        <option value="">州</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.stateCode}>{loc.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="city"
                        placeholder="城市"
                        className="layui-input flex-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="layui-textarea"
                    rows={6}
                    placeholder="请详细描述职位职责、工作内容等..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* 第二步：薪资要求 */}
          {formStep === 2 && (
            <div className="layui-anim layui-anim-fadein">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--layui-primary)] text-white flex items-center justify-center text-sm">2</span>
                薪资与要求
              </h3>

              <div className="space-y-5">
                {/* 薪资信息 */}
                <div className="layui-panel">
                  <div className="layui-panel-title flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    薪资信息
                  </div>
                  <div className="layui-panel-body">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          薪资类型
                        </label>
                        <select name="salaryType" className="layui-select">
                          {SALARY_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最低薪资 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            name="salaryMin"
                            placeholder="0"
                            className="layui-input pl-7"
                            required
                          />
                        </div>
                      </div>

                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最高薪资 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            name="salaryMax"
                            placeholder="0"
                            className="layui-input pl-7"
                            required
                          />
                        </div>
                      </div>

                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          货币单位
                        </label>
                        <select name="currency" className="layui-select">
                          <option value="USD">美元 (USD)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 任职要求 */}
                <div className="layui-panel">
                  <div className="layui-panel-title flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    任职要求
                  </div>
                  <div className="layui-panel-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          经验要求
                        </label>
                        <select name="experience" className="layui-select">
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="layui-form-item">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          学历要求
                        </label>
                        <select name="education" className="layui-select">
                          {EDUCATION_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    任职要求详情 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="requirements"
                    className="layui-textarea"
                    rows={4}
                    placeholder="请列出具体的任职要求，每行一条..."
                    required
                  />
                </div>

                <div className="layui-form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位福利
                  </label>
                  <textarea
                    name="benefits"
                    className="layui-textarea"
                    rows={3}
                    placeholder="请列出职位福利，每行一条，如：五险一金、带薪年假等..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 第三步：确认提交 */}
          {formStep === 3 && (
            <div className="layui-anim layui-anim-fadein">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--layui-primary)] text-white flex items-center justify-center text-sm">3</span>
                确认信息
              </h3>

              <div className="space-y-4">
                <div className="layui-panel">
                  <div className="layui-panel-body text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-[var(--layui-primary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">准备好发布了吗？</h4>
                    <p className="text-gray-600">请确认以上信息无误后，点击发布按钮完成职位发布</p>
                  </div>
                </div>

                <div className="layui-panel">
                  <div className="layui-panel-title">发布须知</div>
                  <div className="layui-panel-body">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>请确保职位信息真实、准确、完整</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>职位发布后将进入审核队列，审核通过后公开显示</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>您可以随时在企业管理后台编辑或下架职位</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex gap-4 pt-6 border-t">
            {formStep > 1 && (
              <button
                type="button"
                className="layui-btn layui-btn-outline"
                onClick={() => setFormStep(formStep - 1)}
              >
                上一步
              </button>
            )}
            <div className="flex-1" />
            {formStep < 3 ? (
              <button
                type="button"
                className="layui-btn"
                onClick={() => setFormStep(formStep + 1)}
              >
                下一步
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="layui-btn layui-btn-outline"
                  onClick={() => router.back()}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="layui-btn"
                  disabled={loading}
                >
                  {loading ? '提交中...' : '确认发布'}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
