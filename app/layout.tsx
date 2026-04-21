import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "168招聘网 - 美国华人招聘平台",
  description: "美国华人168招聘网，为在美华人提供优质的求职招聘服务",
  keywords: "美国招聘,华人招聘,168招聘网,美国找工作,华人求职",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/layui/css/layui.css" />
      </head>
      <body className="bg-gray-100">
      <Header/>
      {children}
      <footer className="layui-bg-dark" style={{marginTop: '20px',paddingTop: '20px'}}>
          <div className="layui-container">
              <div className="layui-row layui-col-space30">
                  <div className="layui-col-md4 layui-col-sm6">
                      <h2 className="layui-font-white layui-font-title layui-mb15">168招聘网</h2>
                      <p className="layui-font-gray layui-font-sm layui-mb20">
                          美国华人168招聘网是专为在美华人打造的求职招聘平台，致力于连接优秀人才与企业。
                      </p>
                  </div>
                  <div className="layui-col-md2 layui-col-sm6 layui-col-xs6">
                      <h3 className="layui-font-white layui-font-bold layui-mb15">关于我们</h3>
                      <ul className="layui-unstyled-list">
                          <li className="layui-mb10">
                              <Link href="/about" className="layui-font-gray layui-text-decoration-none">平台介绍</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/contact" className="layui-font-gray layui-text-decoration-none">联系我们</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/privacy" className="layui-font-gray layui-text-decoration-none">隐私政策</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/terms" className="layui-font-gray layui-text-decoration-none">服务条款</Link>
                          </li>
                      </ul>
                  </div>
                  <div className="layui-col-md3 layui-col-sm6 layui-col-xs6">
                      <h3 className="layui-font-white layui-font-bold layui-mb15">求职帮助</h3>
                      <ul className="layui-unstyled-list">
                          <li className="layui-mb10">
                              <Link href="/help/search" className="layui-font-gray layui-text-decoration-none">如何搜索</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/help/apply" className="layui-font-gray layui-text-decoration-none">如何申请</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/help/resume" className="layui-font-gray layui-text-decoration-none">简历建议</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/help/interview" className="layui-font-gray layui-text-decoration-none">面试技巧</Link>
                          </li>
                      </ul>
                  </div>
                  <div className="layui-col-md3 layui-col-sm6 layui-col-xs6">
                      <h3 className="layui-font-white layui-font-bold layui-mb15">企业服务</h3>
                      <ul className="layui-unstyled-list">
                          <li className="layui-mb10">
                              <Link href="/post" className="layui-font-gray layui-text-decoration-none">发布职位</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/pricing" className="layui-font-gray layui-text-decoration-none">价格方案</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/company/verify" className="layui-font-gray layui-text-decoration-none">企业认证</Link>
                          </li>
                          <li className="layui-mb10">
                              <Link href="/api" className="layui-font-gray layui-text-decoration-none">API接口</Link>
                          </li>
                      </ul>
                  </div>
              </div>
              <div className="layui-row layui-mt30 layui-pt20 layui-border-gray-top">
                  <div className="layui-col-md4 layui-col-sm4 layui-col-xs12 layui-text-center layui-mb15">
                      <i className="layui-icon layui-icon-email layui-font-blue layui-font-title"></i>
                      <p className="layui-font-gray layui-font-sm layui-mt5">support@168zhaopin.com</p>
                  </div>
                  <div className="layui-col-md4 layui-col-sm4 layui-col-xs12 layui-text-center layui-mb15">
                      <i className="layui-icon layui-icon-cellphone layui-font-blue layui-font-title"></i>
                      <p className="layui-font-gray layui-font-sm layui-mt5">1-800-168-1688</p>
                  </div>
                  <div className="layui-col-md4 layui-col-sm4 layui-col-xs12 layui-text-center layui-mb15">
                      <i className="layui-icon layui-icon-time layui-font-blue layui-font-title"></i>
                      <p className="layui-font-gray layui-font-sm layui-mt5">周一至周五 9:00-18:00</p>
                  </div>
              </div>
              <div className="layui-mt20 layui-text-center layui-pt20 layui-border-gray-top">
                  <p className="layui-font-gray layui-font-sm layui-mb5">
                      © {new Date().getFullYear()} 168招聘网. All rights reserved. 美国华人招聘平台
                  </p>
                  <p className="layui-font-xs layui-font-gray-light">
                      Made with ❤️ for Chinese Community in USA
                  </p>
              </div>
          </div>
      </footer>
      </body>
      <Script
          src="/layui/layui.js"
          strategy="afterInteractive"
      />
    </html>
  );
}
