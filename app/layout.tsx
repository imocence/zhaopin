import type { Metadata } from "next";
import Link from 'next/link';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";

// Google font imports removed to avoid Turbopack font fetch errors in CI/offline builds

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
            className={`h-full antialiased`}
        >
            <head>
                <link rel="stylesheet" href="/layui/css/layui-min.css" />
            </head>
            <body className="layui-layout layui-bg-gray">
                <Header />
                <main className="layui-layout-main">{children}</main>
                <footer className="layui-bg-black layui-footer-site">
                    <div className="layui-container">
                        <div className="layui-row layui-col-space30">
                            <div className="layui-col-md4 layui-col-sm6">
                                <h2 className="layui-font-white layui-font-title layui-mb15">168招聘网</h2>
                                <p className="layui-font-gray layui-font-sm layui-mb20">
                                    美国华人168招聘网是专为在美华人打造的求职招聘平台，致力于连接优秀人才与企业。
                                </p>
                            </div>
                            <div className="layui-col-md3 layui-col-sm6 layui-col-xs6">
                                <h3 className="layui-font-white layui-font-bold layui-mb15">企业服务</h3>
                                <ul className="layui-unstyled-list">
                                    <li className="layui-mb10">
                                        <Link href="/post" prefetch={false} className="layui-font-gray layui-text-decoration-none">发布职位</Link>
                                    </li>
                                    <li className="layui-mb10">
                                        <Link href="/company/verify" prefetch={false} className="layui-font-gray layui-text-decoration-none">企业认证</Link>
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
