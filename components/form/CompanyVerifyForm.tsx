'use client';

import React, { useState, useEffect } from 'react';
import { Location } from '@/types';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { locationService } from '@/lib/services/data';

const CompanyVerifyForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function loadLocations() {
      const locs = await locationService.getAll();
      setLocations(locs);
    }
    loadLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: 实现表单提交逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert('企业认证申请已提交！');
      router.push('/user');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="layui-card">
        <div className="layui-card-header">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">企业认证</h2>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= i
                      ? 'bg-[var(--layui-primary)] text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="layui-card-body space-y-6">
          {/* 进度指示 */}
          <div className="flex text-sm text-gray-600 mb-4">
            <span className={step === 1 ? 'text-[var(--layui-primary)] font-medium' : ''}>
              基本信息
            </span>
            <span className="mx-2">→</span>
            <span className={step === 2 ? 'text-[var(--layui-primary)] font-medium' : ''}>
              营业执照
            </span>
            <span className="mx-2">→</span>
            <span className={step === 3 ? 'text-[var(--layui-primary)] font-medium' : ''}>
              确认提交
            </span>
          </div>

          {/* 步骤1：基本信息 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业名称 *
                </label>
                <Input
                  name="companyName"
                  placeholder="请输入企业全称"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  请与营业执照上的企业名称保持一致
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属行业 *
                </label>
                <select name="industry" className="layui-select" required>
                  <option value="">请选择行业</option>
                  <option value="互联网">互联网</option>
                  <option value="电子商务">电子商务</option>
                  <option value="金融">金融</option>
                  <option value="教育">教育</option>
                  <option value="医疗">医疗</option>
                  <option value="制造业">制造业</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业规模 *
                </label>
                <select name="companySize" className="layui-select" required>
                  <option value="">请选择规模</option>
                  <option value="1-50人">1-50人</option>
                  <option value="50-150人">50-150人</option>
                  <option value="150-500人">150-500人</option>
                  <option value="500-1000人">500-1000人</option>
                  <option value="1000+人">1000+人</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    所在州 *
                  </label>
                  <select name="state" className="layui-select" required>
                    <option value="">请选择</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.stateCode}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    所在城市 *
                  </label>
                  <Input
                    name="city"
                    placeholder="例如：洛杉矶"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业地址
                </label>
                <textarea
                  name="address"
                  className="layui-textarea"
                  rows={2}
                  placeholder="请输入详细地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业简介 *
                </label>
                <textarea
                  name="description"
                  className="layui-textarea"
                  rows={4}
                  placeholder="请简要介绍企业业务、发展历程等"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系人 *
                  </label>
                  <Input
                    name="contactName"
                    placeholder="联系人姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 *
                  </label>
                  <Input
                    name="contactPhone"
                    type="tel"
                    placeholder="请输入联系电话"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业邮箱 *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="企业邮箱"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业网站
                  </label>
                  <Input
                    name="website"
                    type="url"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 步骤2：营业执照 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  营业执照号码 *
                </label>
                <Input
                  name="licenseNumber"
                  placeholder="请输入营业执照号码"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  营业执照照片 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">
                    点击上传或拖拽文件到此处
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 JPG、PNG、PDF 格式，文件大小不超过 5MB
                  </p>
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    选择文件
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    上传企业Logo
                  </p>
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png" />
                  <Button type="button" variant="outline" size="sm">
                    选择图片
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ 请确保上传的营业执照清晰可见，信息完整。审核通过后，企业将获得&quot;已认证&quot;标识。
                </p>
              </div>
            </div>
          )}

          {/* 步骤3：确认提交 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  请确认以下信息无误后提交。提交后我们将在1-3个工作日内完成审核。
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">企业名称</span>
                  <span className="font-medium">示例科技有限公司</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">所属行业</span>
                  <span className="font-medium">互联网</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">企业规模</span>
                  <span className="font-medium">50-150人</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">所在地区</span>
                  <span className="font-medium">加利福尼亚州 洛杉矶</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">联系人</span>
                  <span className="font-medium">张三</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">联系邮箱</span>
                  <span className="font-medium">contact@example.com</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" required />
                  <span className="text-sm text-gray-700">
                    我确认以上信息真实有效，并同意《企业认证服务协议》
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-4 border-t">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                上一步
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '提交中...' : step === 3 ? '提交认证' : '下一步'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyVerifyForm;
