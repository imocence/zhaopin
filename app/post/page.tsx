'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS, SALARY_TYPE_OPTIONS } from '@/lib/constants';
import { categoryService, locationService } from '@/lib/utils/data';

interface FormData {
  title: string;
  category: string;
  state: string;
  city: string;
  description: string;
  salaryType: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  experience: string;
  education: string;
  requirements: string;
  benefits: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  title: '',
  category: '',
  state: '',
  city: '',
  description: '',
  salaryType: 'yearly',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  experience: '不限',
  education: '不限',
  requirements: '',
  benefits: '',
};

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({}); // 仅用于记录当前步骤验证状态
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

        // 注册自定义 lay-verify 验证规则
        form.verify({
          required: function(value: string, elem: HTMLElement) {
            if (!value || !value.trim()) {
              const label = elem.closest('.layui-form-item')?.querySelector('.layui-form-label-enhanced')?.textContent?.replace(' *', '').trim() || '此字段';
              return label + '不能为空';
            }
          },
          number: function(value: string) {
            if (value && isNaN(Number(value))) {
              return '请输入有效的数字';
            }
          },
          salaryCheck: function(value: string) {
            const formEl = formRef.current;
            if (!formEl) return;
            const salaryMinInput = formEl.querySelector('[name="salaryMin"]') as HTMLInputElement;
            const salaryMaxInput = formEl.querySelector('[name="salaryMax"]') as HTMLInputElement;
            if (salaryMinInput && salaryMaxInput) {
              const min = Number(salaryMinInput.value);
              const max = Number(salaryMaxInput.value);
              if (min > 0 && max > 0 && min > max) {
                return '最高薪资不能低于最低薪资';
              }
            }
          }
        });

        // 监听 layui select 变化
        form.on('select(*)', function(data: { elem: HTMLElement; value: string }) {
          const name = data.elem.getAttribute('name');
          if (name) {
            setFormData(prev => {
              const newData = { ...prev, [name]: data.value };
              // 更新后需要重新渲染 select，确保 React 和 layui 同步
              setTimeout(() => {
                form.render('select');
              }, 0);
              return newData;
            });
          }
        });

        // 使用 layui form.on('submit') 监听"下一步"按钮提交
        form.on('submit(nextStep)', function(data: { field: Record<string, string> }) {
          // 同步 layui 表单数据到 React state（确保 select 值正确）
          setFormData(prev => ({ ...prev, ...data.field }));
          setFormStep(formStep + 1);
          return false;
        });

        // 使用 layui form.on('submit') 监听最终提交
        form.on('submit(postJobSubmit)', function(data: { field: Record<string, string> }) {
          setFormData(prev => ({ ...prev, ...data.field }));
          setErrors({});
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
            alert('职位发布成功！');
            router.push('/jobs');
          }, 1000);

          return false;
        });

      });
    };
    initLayui();
  }, [formStep, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleNext = () => {
    // 由于分步渲染，非当前步骤的元素不在 DOM 中
    // layui 的 lay-submit 会自动验证当前 DOM 中带 lay-verify 的元素
    // 验证通过后 form.on('submit(nextStep)') 会被调用，进入下一步
  };

  const handlePrev = () => {
    setErrors({});
    setFormStep(formStep - 1);
  };

  const handleSubmit = async () => {
    // 最终提交由 layui form.on('submit') 处理
  };

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-post-wrap">
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
                <div className="layui-post-emoji-box">
                  💼
                </div>
              </div>
            </div>

            {/* 步骤指示器 */}
            <div className="layui-mt30 layui-p20 layui-post-step-panel">
              <div className="layui-flex layui-flex-center">
                <div className="layui-flex layui-flex-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className="layui-flex layui-align-center">
                        <div className={`layui-step-dot ${formStep >= step ? 'layui-step-dot--on' : 'layui-step-dot--off'}`}>
                          {formStep > step ? '✓' : step}
                        </div>
                        <div className={`layui-ml10 layui-font-sm layui-font-bold ${formStep >= step ? 'layui-step-label--on' : 'layui-step-label--off'}`}>
                          {step === 1 ? '基本信息' : step === 2 ? '薪资要求' : '确认提交'}
                        </div>
                      </div>
                      {step < 3 && (
                        <div className={`layui-step-line ${formStep > step ? 'layui-step-line--on' : 'layui-step-line--off'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form ref={formRef} className="layui-form">
          {/* 第一步：基本信息 */}
          {formStep === 1 && (
            <div className="layui-card layui-card-enhanced layui-mb20">
              <div className="layui-card-header layui-card-header-bg">
                <div className="layui-flex layui-flex-center">
                  <div className="layui-filter-tag layui-filter-tag-cyan">1</div>
                  <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">基本信息</div>
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
                    lay-verify="required"
                    className="layui-input layui-input-enhanced"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="layui-row layui-col-space20">
                  <div className="layui-col-md6">
                    <div className="layui-form-item layui-form-item-enhanced">
                      <label className="layui-form-label-enhanced">
                        职位分类 <span className="layui-font-red"> *</span>
                      </label>
                      <select name="category" className="layui-select" lay-verify="required">
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
                      <div className="layui-flex layui-flex-wrap layui-gap-10">
                        <div className="layui-flex-1">
                          <select name="state" className="layui-select" lay-verify="required">
                            <option value="">州</option>
                            {locations.map((loc) => (
                              <option key={loc.id} value={loc.stateCode}>{loc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="layui-flex-2">
                          <input
                            type="text"
                            name="city"
                            placeholder="城市"
                            lay-verify="required"
                            className="layui-input layui-input-enhanced"
                            value={formData.city}
                            onChange={handleChange}
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
                    className="layui-textarea layui-textarea-h150"
                    lay-verify="required"
                    placeholder="请详细描述职位职责、工作内容等..."
                    value={formData.description}
                    onChange={handleChange}
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
                    <div className="layui-filter-tag layui-filter-tag-green">2</div>
                    <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">薪资与要求</div>
                  </div>
                </div>
                <div className="layui-card-body layui-card-body-p25">
                  {/* 薪资信息 */}
                  <div className="layui-mb20">
                    <h3 className="layui-font-lg layui-font-bold layui-mb15 layui-flex layui-flex-center">
                      <i className="layui-icon layui-icon-template-1 layui-font-cyan layui-mr5"></i>
                      薪资信息
                    </h3>
                    <div className="layui-form-panel-gray">
                      <div className="layui-row layui-col-space15">
                        <div className="layui-col-md3">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">薪资类型</label>
                            <select name="salaryType" className="layui-select">
                              {SALARY_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} selected={opt.value === 'yearly'}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="layui-col-md3">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">
                              最低薪资 <span className="layui-font-red"> *</span>
                            </label>
                            <div className="layui-input-prefix-dollar">
                              <span className="layui-input-dollar">$</span>
                              <input
                                type="number"
                                name="salaryMin"
                                placeholder="0"
                                lay-verify="required|number|salaryCheck"
                                className="layui-input layui-input-enhanced"
                                value={formData.salaryMin}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="layui-col-md3">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">
                              最高薪资 <span className="layui-font-red"> *</span>
                            </label>
                            <div className="layui-input-prefix-dollar">
                              <span className="layui-input-dollar">$</span>
                              <input
                                type="number"
                                name="salaryMax"
                                placeholder="0"
                                lay-verify="required|number|salaryCheck"
                                className="layui-input layui-input-enhanced"
                                value={formData.salaryMax}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="layui-col-md3">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">货币单位</label>
                            <select name="currency" className="layui-select">
                              <option value="USD" selected>美元 (USD)</option>
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
                    <div className="layui-form-panel-gray">
                      <div className="layui-row layui-col-space15">
                        <div className="layui-col-md6">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">经验要求</label>
                            <select name="experience" className="layui-select">
                              {EXPERIENCE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} selected={opt.value === '不限'}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="layui-col-md6">
                          <div className="layui-form-item layui-form-item-enhanced">
                            <label className="layui-form-label-enhanced">学历要求</label>
                            <select name="education" className="layui-select">
                              {EDUCATION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} selected={opt.value === '不限'}>{opt.label}</option>
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
                      className="layui-textarea layui-textarea-h120"
                      lay-verify="required"
                      placeholder="请列出具体的任职要求，每行一条..."
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="layui-form-item layui-form-item-enhanced">
                    <label className="layui-form-label-enhanced">职位福利</label>
                    <textarea
                      name="benefits"
                      className="layui-textarea layui-textarea-h100"
                      placeholder="请列出职位福利，每行一条，如：五险一金、带薪年假等..."
                      value={formData.benefits}
                      onChange={handleChange}
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
                  <div className="layui-filter-tag layui-filter-tag-orange">3</div>
                  <div className="layui-ml10 layui-font-xl layui-font-bold layui-font-cyan">确认提交</div>
                </div>
              </div>
              <div className="layui-card-body layui-card-body-p30">
                <div className="layui-text-center layui-p30">
                  <div className="layui-emoji-success">✅</div>
                  <h3 className="layui-font-2xl layui-font-bold layui-mb10 layui-font-cyan">
                    准备好发布了吗？
                  </h3>
                  <p className="layui-font-gray-99 layui-font-lg layui-mb25">
                    请确认以上信息无误后，点击发布按钮完成职位发布
                  </p>
                </div>

                <div className="layui-form-panel-gray layui-form-panel-gray--lg">
                  <h3 className="layui-font-lg layui-font-bold layui-mb20 layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-about layui-font-orange layui-mr5"></i>
                    发布须知
                  </h3>
                  <ul className="layui-unstyled-list layui-list-inset">
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
              <div className="layui-flex-gap-15">
                {formStep > 1 && (
                  <button
                    type="button"
                    className="layui-btn layui-btn-outline layui-btn-enhanced"
                    onClick={handlePrev}
                  >
                    <i className="layui-icon layui-icon-left"></i> 上一步
                  </button>
                )}
              </div>
              <div className="layui-flex-gap-15">
                {formStep < 3 ? (
                  <button
                    type="button"
                    className="layui-btn layui-btn-enhanced"
                    lay-submit=""
                    lay-filter="nextStep"
                    onClick={handleNext}
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
                      type="button"
                      className="layui-btn layui-btn-enhanced"
                      lay-submit=""
                      lay-filter="postJobSubmit"
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
    </div>
  );
}
