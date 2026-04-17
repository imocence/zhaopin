'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS, SALARY_TYPE_OPTIONS } from '@/lib/constants';
import { categoryService, locationService } from '@/lib/utils/data';

const PostJobForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const categories = categoryService.getAllSubcategories();
  const locations = locationService.getAll();

  useEffect(() => {
    const initLayui = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLayui, 100);
        return;
      }
      layui.use(['form', 'element'], function() {
        const form = layui.form;
        const element = layui.element;
        if (formRef.current) {
          form.render();
        }
        element.render('tab');
      });
    };
    initLayui();
  }, [formStep]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    alert('职位发布成功！');
    router.push('/jobs');
  };

  return (
    <div style={{maxWidth: '900px', margin: '0 auto'}}>
      {/* 页面头部 */}
      <div className="layui-card layui-mb20 layui-page-header">
        <div className="layui-page-header-body layui-bg-gradient-cyan">
          <div className="layui-flex layui-flex-between">
            <div>
              <h1 className="layui-font-white layui-font-3xl layui-font-bold layui-mb5">
                发布新职位
              </h1>
              <p className="layui-font-gray-light layui-font-lg">
                填写职位信息，吸引优秀人才
              </p>
            </div>
            <div className="layui-header-icon">
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                💼
              </div>
            </div>
          </div>

          {/* 步骤指示器 */}
          <div className="layui-mt30 layui-p20" style={{background: 'rgba(255,255,255,0.95)', borderRadius: '8px'}}>
            <div className="layui-flex layui-flex-center">
              <div className="layui-flex layui-flex-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="layui-flex" style={{alignItems: 'center'}}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: formStep >= step ? '#009688' : '#e8e8e8',
                        color: formStep >= step ? '#fff' : '#999'
                      }}>
                        {formStep > step ? '✓' : step}
                      </div>
                      <div className="layui-ml10 layui-font-sm layui-font-bold" style={{color: formStep >= step ? '#009688' : '#999'}}>
                        {step === 1 ? '基本信息' : step === 2 ? '薪资要求' : '确认提交'}
                      </div>
                    </div>
                    {step < 3 && (
                      <div style={{
                        width: '60px',
                        height: '2px',
                        margin: '0 15px',
                        background: formStep > step ? '#009688' : '#e8e8e8'
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="layui-form">
        {/* 第一步：基本信息 */}
        {formStep === 1 && (
          <div className="layui-card layui-card-enhanced layui-mb20">
            <div className="layui-card-header layui-card-header-bg">
              <div className="layui-flex layui-flex-center">
                <div className="layui-filter-tag layui-filter-tag-cyan">
                  1
                </div>
                <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">
                  基本信息
                </div>
              </div>
            </div>
            <div className="layui-card-body layui-card-body-p25">
              <div className="layui-form-item layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  职位标题 <span className="layui-font-red"> *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="例如：高级前端工程师"
                  className="layui-input layui-input-enhanced"
                  required
                  lay-verify="required"
                />
              </div>

              <div className="layui-row layui-col-space20">
                <div className="layui-col-md6">
                  <div className="layui-form-item layui-form-item-enhanced">
                    <label className="layui-form-label-enhanced">
                      职位分类 <span className="layui-font-red"> *</span>
                    </label>
                    <select name="category" className="layui-select" required lay-verify="required">
                      <option value="">请选择分类</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="layui-col-md6">
                  <div className="layui-form-item layui-form-item-enhanced">
                    <label className="layui-form-label-enhanced">
                      工作地点 <span className="layui-font-red"> *</span>
                    </label>
                    <div className="layui-flex layui-flex-wrap" style={{gap: '10px'}}>
                      <div style={{flex: '1'}}>
                        <select name="state" className="layui-select" required lay-verify="required">
                          <option value="">州</option>
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.stateCode}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{flex: '2'}}>
                        <input
                          type="text"
                          name="city"
                          placeholder="城市"
                          className="layui-input layui-input-enhanced"
                          required
                          lay-verify="required"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="layui-form-item layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  职位描述 <span className="layui-font-red"> *</span>
                </label>
                <textarea
                  name="description"
                  className="layui-textarea"
                  style={{height: '150px'}}
                  placeholder="请详细描述职位职责、工作内容等..."
                  required
                  lay-verify="required"
                />
              </div>
            </div>
          </div>
        )}

        {/* 第二步：薪资要求 */}
        {formStep === 2 && (
          <>
            <div className="layui-card layui-card-enhanced layui-mb20">
              <div className="layui-card-header layui-card-header-bg">
                <div className="layui-flex layui-flex-center">
                  <div className="layui-filter-tag layui-filter-tag-green">
                    2
                  </div>
                  <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">
                    薪资与要求
                  </div>
                </div>
              </div>
              <div className="layui-card-body layui-card-body-p25">
                {/* 薪资信息 */}
                <div className="layui-mb20">
                  <h3 className="layui-font-lg layui-font-bold layui-mb15 layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-template-1 layui-font-cyan layui-mr5"></i>
                    薪资信息
                  </h3>
                  <div style={{background: '#f8f8f8', padding: '20px', borderRadius: '8px'}}>
                    <div className="layui-row layui-col-space15">
                      <div className="layui-col-md3">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">薪资类型</label>
                          <select name="salaryType" className="layui-select">
                            {SALARY_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="layui-col-md3">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">
                            最低薪资 <span className="layui-font-red"> *</span>
                          </label>
                          <div style={{position: 'relative'}}>
                            <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}}>$</span>
                            <input
                              type="number"
                              name="salaryMin"
                              placeholder="0"
                              className="layui-input layui-input-enhanced"
                              style={{paddingLeft: '25px'}}
                              required
                              lay-verify="required"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="layui-col-md3">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">
                            最高薪资 <span className="layui-font-red"> *</span>
                          </label>
                          <div style={{position: 'relative'}}>
                            <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}}>$</span>
                            <input
                              type="number"
                              name="salaryMax"
                              placeholder="0"
                              className="layui-input layui-input-enhanced"
                              style={{paddingLeft: '25px'}}
                              required
                              lay-verify="required"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="layui-col-md3">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">货币单位</label>
                          <select name="currency" className="layui-select">
                            <option value="USD">美元 (USD)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 任职要求 */}
                <div>
                  <h3 className="layui-font-lg layui-font-bold layui-mb15 layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-circle-dot layui-font-cyan layui-mr5"></i>
                    任职要求
                  </h3>
                  <div style={{background: '#f8f8f8', padding: '20px', borderRadius: '8px'}}>
                    <div className="layui-row layui-col-space15">
                      <div className="layui-col-md6">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">经验要求</label>
                          <select name="experience" className="layui-select">
                            {EXPERIENCE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="layui-col-md6">
                        <div className="layui-form-item layui-form-item-enhanced">
                          <label className="layui-form-label-enhanced">学历要求</label>
                          <select name="education" className="layui-select">
                            {EDUCATION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="layui-form-item layui-form-item-enhanced layui-mt20">
                  <label className="layui-form-label-enhanced">
                    任职要求详情 <span className="layui-font-red"> *</span>
                  </label>
                  <textarea
                    name="requirements"
                    className="layui-textarea"
                    style={{height: '120px'}}
                    placeholder="请列出具体的任职要求，每行一条..."
                    required
                    lay-verify="required"
                  />
                </div>

                <div className="layui-form-item layui-form-item-enhanced">
                  <label className="layui-form-label-enhanced">职位福利</label>
                  <textarea
                    name="benefits"
                    className="layui-textarea"
                    style={{height: '100px'}}
                    placeholder="请列出职位福利，每行一条，如：五险一金、带薪年假等..."
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* 第三步：确认提交 */}
        {formStep === 3 && (
          <div className="layui-card layui-card-enhanced layui-mb20">
            <div className="layui-card-header layui-card-header-bg">
              <div className="layui-flex layui-flex-center">
                <div className="layui-filter-tag layui-filter-tag-orange">
                  3
                </div>
                <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">
                  确认提交
                </div>
              </div>
            </div>
            <div className="layui-card-body layui-card-body-p30">
              <div className="layui-text-center layui-p30">
                <div style={{fontSize: '80px', marginBottom: '20px'}}>✅</div>
                <h3 className="layui-font-2xl layui-font-bold layui-mb10 layui-font-cyan">
                  准备好发布了吗？
                </h3>
                <p className="layui-font-gray-99 layui-font-lg layui-mb25">
                  请确认以上信息无误后，点击发布按钮完成职位发布
                </p>
              </div>

              <div style={{background: '#f8f8f8', padding: '25px', borderRadius: '8px', marginBottom: '20px'}}>
                <h3 className="layui-font-lg layui-font-bold layui-mb20 layui-flex layui-flex-center">
                  <i className="layui-icon layui-icon-about layui-font-orange layui-mr5"></i>
                  发布须知
                </h3>
                <ul className="layui-unstyled-list" style={{padding: '0 20px'}}>
                  <li className="layui-flex layui-flex-center layui-mb15">
                    <i className="layui-icon layui-icon-ok layui-font-green layui-mr10 layui-font-lg"></i>
                    <span className="layui-font-gray-66 layui-font-lg">请确保职位信息真实、准确、完整</span>
                  </li>
                  <li className="layui-flex layui-flex-center layui-mb15">
                    <i className="layui-icon layui-icon-ok layui-font-green layui-mr10 layui-font-lg"></i>
                    <span className="layui-font-gray-66 layui-font-lg">职位发布后将进入审核队列，审核通过后公开显示</span>
                  </li>
                  <li className="layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-ok layui-font-green layui-mr10 layui-font-lg"></i>
                    <span className="layui-font-gray-66 layui-font-lg">您可以随时在企业管理后台编辑或下架职位</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 底部按钮 */}
        <div className="layui-card layui-mb30">
          <div className="layui-card-body layui-flex layui-flex-between layui-pt20 layui-border-top">
            <div className="layui-flex" style={{gap: '15px'}}>
              {formStep > 1 && (
                <button
                  type="button"
                  className="layui-btn layui-btn-outline layui-btn-enhanced"
                  onClick={() => setFormStep(formStep - 1)}
                >
                  <i className="layui-icon layui-icon-left"></i> 上一步
                </button>
              )}
            </div>
            <div className="layui-flex" style={{gap: '15px'}}>
              {formStep < 3 ? (
                <button
                  type="button"
                  className="layui-btn layui-btn-enhanced"
                  onClick={() => setFormStep(formStep + 1)}
                >
                  下一步 <i className="layui-icon layui-icon-right"></i>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="layui-btn layui-btn-outline layui-btn-enhanced"
                    onClick={() => router.back()}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="layui-btn layui-btn-enhanced"
                    disabled={loading}
                  >
                    {loading ? <><i className="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i> 提交中...</> : <><i className="layui-icon layui-icon-release"></i> 确认发布</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
