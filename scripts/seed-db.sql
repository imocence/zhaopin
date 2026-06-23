-- 招聘网站数据库种子数据

-- 生成时间: 2026-06-23T07:24:24.277Z



INSERT OR REPLACE INTO users (id, email, name, avatar, role, phone, location, state, resume, bio, created_at) VALUES ('1', 'admin@example.com', 'admin', '/images/avatars/default.png', 'root', '+1-415-123-4567', '旧金山', 'CA', '/resumes/demo_resume.pdf', '5年前端开发经验，熟练 React 和 Vue 等前端框架。', '2023-01-01');

INSERT OR REPLACE INTO users (id, email, name, avatar, role, phone, location, state, resume, bio, created_at) VALUES ('2', 'lisi@example.com', '李四', '/images/avatars/default.png', 'employer', '+1-650-234-5678', '帕洛阿尔托', 'CA', NULL, '某科技公司 HR，负责技术招聘。', '2023-02-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company1', '腾讯美国', '/images/logos/tencent.png', '互联网', '1000+人', '帕洛阿尔托', NULL, 'CA', '腾讯美国分公司，负责腾讯产品在北美市场的推广和研发。', 'https://www.tencent.com', 'hr-us@tencent.com', '+1-650-123-4567', 1, '2023-01-15', 0, '2023-01-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company2', '字节跳动', '/images/logos/bytedance.png', '互联网', '10000+人', '洛杉矶', NULL, 'CA', '字节跳动美国总部，运营TikTok等产品。', 'https://www.bytedance.com', 'careers-us@bytedance.com', NULL, 1, '2023-02-01', 0, '2023-01-15');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company3', '阿里巴巴美国', '/images/logos/alibaba.png', '电子商务', '500+人', '圣克拉拉', NULL, 'CA', '阿里巴巴美国分公司，负责电商云服务在北美市场。', 'https://www.alibaba.com', 'jobs-us@alibaba.com', NULL, 1, '2023-03-01', 0, '2023-02-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company4', '比亚迪美国', '/images/logos/byd.png', '汽车制造', '200+人', '兰卡斯特', NULL, 'CA', '比亚迪美国工厂，生产电动巴士和储能产品。', 'https://www.byd.com', 'hr@byd.com', NULL, 1, '2023-04-01', 0, '2023-03-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company5', '华为美国', '/images/logos/huawei.png', '通信技术', '300+人', '普莱诺', NULL, 'TX', '华为美国研发中心，专注于5G和通信技术研发。', 'https://www.huawei.com', 'recruit-us@huawei.com', NULL, 0, NULL, 0, '2023-04-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company6', '小米美国', '/images/logos/xiaomi.png', '消费电子', '150+人', '圣何塞', NULL, 'CA', '小米美国分公司，负责手机和IoT产品在北美市场。', 'https://www.mi.com', 'us-hr@xiaomi.com', NULL, 1, '2023-05-01', 0, '2023-05-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company7', '大疆创新', '/images/logos/dji.png', '无人系统', '100+人', '好莱坞', NULL, 'CA', '大疆美国分公司，全球领先的无人机制造商。', 'https://www.dji.com', 'careers@dji.com', NULL, 1, '2023-06-01', 0, '2023-06-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company8', '药明康德美国', '/images/logos/wuxi.png', '生物医药', '500+人', '新泽西州', NULL, 'NJ', '药明康德美国分公司，提供生物医药研发服务。', 'https://www.wuxiapptec.com', 'hr-us@wuxiapptec.com', NULL, 1, '2023-07-01', 0, '2023-07-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company9', '中车美国', '/images/logos/crrc.png', '轨道交通', '200+人', '芝加哥', NULL, 'IL', '中车美国公司，负责轨道交通装备制造。', 'https://www.crrcgc.cc', 'jobs-us@crrc.com', NULL, 0, NULL, 0, '2023-08-01');

INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('company10', '工商银行美国', '/images/logos/icbc.png', '金融服务', '100+人', '纽约', NULL, 'NY', '工商银行美国分行，提供跨境金融服务。', 'https://www.icbc.com.cn', 'recruit@icbc-us.com', NULL, 1, '2023-09-01', 0, '2023-09-01');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job1', '高级前端工程师', 'company1', '前端开发', '帕洛阿尔托', 'CA', 120000, 180000, 'yearly', '3-5年', '本科', '负责公司核心产品的前端开发工作，使用React、TypeScript等技术栈。', '["精通React/Vue等前端框架","熟悉TypeScript","有大型项目经验","良好的沟通能力"]', '["五险一金","带薪年假","弹性工作","股票期权"]', 'active', 1250, 45, '2024-01-15', '2024-01-15');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job2', '后端开发工程师', 'company1', '后端开发', '帕洛阿尔托', 'CA', 130000, 190000, 'yearly', '3-5年', '本科', '负责后端服务开发，使用Node.js、Go等技术。', '["精通Node.js或Go","熟悉微服务架构","有高并发经验","熟悉数据库设计"]', '["五险一金","带薪年假","弹性工作","股票期权"]', 'active', 980, 32, '2024-01-14', '2024-01-14');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job3', '产品经理', 'company2', '产品经理', '洛杉矶', 'CA', 110000, 160000, 'yearly', '3-5年', '本科', '负责短视频产品的产品规划和设计。', '["有互联网产品经验","数据分析能力强","优秀的沟通能力","有移动端产品经验"]', '["五险一金","免费三餐","健身房","通勤班车"]', 'active', 1560, 68, '2024-01-13', '2024-01-13');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job4', 'UI设计师', 'company2', 'UI设计师', '洛杉矶', 'CA', 80000, 120000, 'yearly', '1-3年', '本科', '负责移动应用的UI设计工作。', '["精通Figma/Sketch","有移动端设计经验","良好的审美","了解用户体验"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 890, 28, '2024-01-12', '2024-01-12');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job5', '数据分析师', 'company3', '数据分析师', '圣克拉拉', 'CA', 90000, 130000, 'yearly', '1-3年', '硕士', '负责业务数据分析和报表制作。', '["熟悉SQL","掌握Python/R","有数据分析经验","了解统计学"]', '["五险一金","年终奖","带薪年假","培训机会"]', 'active', 756, 24, '2024-01-11', '2024-01-11');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job6', '云架构师', 'company3', 'DevOps', '圣克拉拉', 'CA', 150000, 220000, 'yearly', '5-10年', '本科', '负责云平台架构设计和实施。', '["熟悉AWS/GCP","有Kubernetes经验","了解微服务","有架构设计经验"]', '["五险一金","股票期权","弹性工作","远程办公"]', 'active', 645, 18, '2024-01-10', '2024-01-10');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job7', 'iOS开发工程师', 'company6', '移动开发', '圣何塞', 'CA', 110000, 160000, 'yearly', '3-5年', '本科', '负责iOS应用开发和维护。', '["精通Swift/Objective-C","有App Store上架经验","熟悉iOS SDK","代码质量高"]', '["五险一金","员工购物优惠","带薪年假","团队建设"]', 'active', 1120, 39, '2024-01-09', '2024-01-09');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job8', 'Android开发工程师', 'company6', '移动开发', '圣何塞', 'CA', 110000, 160000, 'yearly', '3-5年', '本科', '负责Android应用开发和维护。', '["精通Kotlin/Java","熟悉Android SDK","有性能优化经验","了解JNI"]', '["五险一金","员工购物优惠","带薪年假","团队建设"]', 'active', 980, 33, '2024-01-08', '2024-01-08');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job9', '嵌入式软件工程师', 'company4', '软件工程师', '兰卡斯特', 'CA', 100000, 150000, 'yearly', '3-5年', '本科', '负责电动巴士嵌入式系统开发。', '["精通C/C++","有嵌入式开发经验","熟悉CAN总线","了解RTOS"]', '["五险一金","住房补贴","班车接送","工作餐"]', 'active', 720, 21, '2024-01-07', '2024-01-07');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job10', '机械工程师', 'company4', '机械工程师', '兰卡斯特', 'CA', 85000, 120000, 'yearly', '3-5年', '本科', '负责电动巴士结构设计。', '["熟悉SolidWorks/AutoCAD","有机械设计经验","了解材料力学","英文流利"]', '["五险一金","住房补贴","班车接送","工作餐"]', 'active', 650, 19, '2024-01-06', '2024-01-06');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job11', '5G通信工程师', 'company5', '通信工程师', '普莱诺', 'TX', 120000, 170000, 'yearly', '5-10年', '硕士', '负责5G网络技术研发。', '["熟悉5G协议","有通信研发经验","掌握C++","了解无线通信"]', '["五险一金","股票期权","住房补贴","子女教育"]', 'active', 890, 25, '2024-01-05', '2024-01-05');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job12', '算法工程师', 'company7', '算法工程师', '好莱坞', 'CA', 140000, 200000, 'yearly', '3-5年', '硕士', '负责无人机视觉算法研发。', '["熟悉计算机视觉","掌握深度学习","有C++/Python经验","论文发表优先"]', '["五险一金","股票期权","免费产品","弹性工作"]', 'active', 1340, 42, '2024-01-04', '2024-01-04');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job13', '生物统计师', 'company8', '生物统计', '新泽西州', 'NJ', 110000, 160000, 'yearly', '1-3年', '博士', '负责临床试验数据统计分析。', '["熟悉SAS/R","有临床试验经验","统计学背景","GCP知识"]', '["五险一金","年终奖","培训机会","职业发展"]', 'active', 580, 15, '2024-01-03', '2024-01-03');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job14', '有机合成研究员', 'company8', '化学研发', '新泽西州', 'NJ', 85000, 120000, 'yearly', '1-3年', '博士', '负责新药合成研发工作。', '["有机合成背景","熟悉HPLC/NMR","有实验室经验","英语流利"]', '["五险一金","实验补贴","培训机会","发表论文"]', 'active', 520, 12, '2024-01-02', '2024-01-02');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job15', '项目经理', 'company9', '项目管理', '芝加哥', 'IL', 100000, 150000, 'yearly', '5-10年', '本科', '负责轨道交通项目管理工作。', '["有PMP认证","工程项目经验","沟通能力强","可适应出差"]', '["五险一金","项目奖金","住房补贴","交通补贴"]', 'active', 690, 22, '2024-01-01', '2024-01-01');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job16', '电气工程师', 'company9', '电气工程师', '芝加哥', 'IL', 90000, 130000, 'yearly', '3-5年', '本科', '负责列车电气系统设计。', '["电气工程背景","熟悉AutoCAD","有轨道交通经验","PE认证优先"]', '["五险一金","项目奖金","培训机会","职业发展"]', 'active', 620, 18, '2023-12-31', '2023-12-31');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job17', '投资分析师', 'company10', '投资分析', '纽约', 'NY', 100000, 150000, 'yearly', '1-3年', '硕士', '负责投资研究和分析工作。', '["CFA认证优先","金融背景","分析能力强","英文流利"]', '["五险一金","年终奖","交易席位","职业发展"]', 'active', 1120, 38, '2023-12-30', '2023-12-30');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job18', '客户关系经理', 'company10', '客户经理', '纽约', 'NY', 80000, 120000, 'yearly', '3-5年', '本科', '负责高净值客户关系维护。', '["有银行经验","沟通能力强","双语优先","有客户资源"]', '["五险一金","业绩提成","培训机会","晋升通道"]', 'active', 780, 26, '2023-12-29', '2023-12-29');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job19', '数字营销专员', 'company2', '数字营销', '洛杉矶', 'CA', 60000, 90000, 'yearly', '1-3年', '本科', '负责短视频平台的数字营销推广。', '["熟悉社交媒体","有营销经验","数据分析能力","创意思维"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 920, 35, '2023-12-28', '2023-12-28');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job20', '内容运营', 'company2', '内容运营', '洛杉矶', 'CA', 55000, 80000, 'yearly', '1年以下', '本科', '负责平台内容策划和运营。', '["有内容运营经验","文案能力强","了解短视频","创意思维"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 1080, 52, '2023-12-27', '2023-12-27');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job21', 'QA工程师', 'company1', 'QA工程师', '帕洛阿尔托', 'CA', 90000, 130000, 'yearly', '1-3年', '本科', '负责产品测试和质量保障。', '["熟悉测试工具","自动化测试经验","了解测试流程","细心负责"]', '["五险一金","带薪年假","弹性工作","股票期权"]', 'active', 740, 23, '2023-12-26', '2023-12-26');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job22', '全栈工程师', 'company3', '全栈开发', '圣克拉拉', 'CA', 120000, 170000, 'yearly', '3-5年', '本科', '负责前后端全栈开发工作。', '["前后端都熟悉","React + Node.js","数据库经验","项目主导经验"]', '["五险一金","年终奖","带薪年假","培训机会"]', 'active', 1180, 41, '2023-12-25', '2023-12-25');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job23', '网络安全工程师', 'company5', '网络安全', '普莱诺', 'TX', 110000, 160000, 'yearly', '3-5年', '本科', '负责网络安全防护工作。', '["安全从业证书","渗透测试经验","熟悉安全工具","应急响应经验"]', '["五险一金","股票期权","住房补贴","培训机会"]', 'active', 860, 27, '2023-12-24', '2023-12-24');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job24', '人力资源专员', 'company1', '人力资源', '帕洛阿尔托', 'CA', 60000, 85000, 'yearly', '1-3年', '本科', '负责招聘和员工关系管理。', '["HR背景","沟通能力强","熟悉劳动法","双语优先"]', '["五险一金","带薪年假","弹性工作","团队建设"]', 'active', 670, 29, '2023-12-23', '2023-12-23');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job25', '财务分析师', 'company3', '财务分析', '圣克拉拉', 'CA', 80000, 110000, 'yearly', '1-3年', '本科', '负责财务分析和预算管理。', '["CPA优先","Excel熟练","财务建模","英文流利"]', '["五险一金","年终奖","带薪年假","培训机会"]', 'active', 710, 20, '2023-12-22', '2023-12-22');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job26', '行政助理', 'company4', '行政助理', '兰卡斯特', 'CA', 40000, 55000, 'yearly', '不限', '大专', '负责日常行政工作。', '["熟练Office","沟通能力","细心负责"," bilingual"]', '["五险一金","带薪年假","工作餐","团队建设"]', 'active', 890, 48, '2023-12-21', '2023-12-21');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job27', '翻译', 'company9', '翻译', '芝加哥', 'IL', 50000, 75000, 'yearly', '1-3年', '本科', '负责技术文档翻译工作。', '["中英文流利","技术背景","CAT工具经验","专业认证"]', '["五险一金","项目奖金","培训机会","远程办公"]', 'active', 560, 17, '2023-12-20', '2023-12-20');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job28', '电商运营', 'company3', '电商运营', '圣克拉拉', 'CA', 65000, 90000, 'yearly', '1-3年', '本科', '负责电商平台运营工作。', '["电商经验","数据分析","营销策划","沟通能力"]', '["五险一金","年终奖","带薪年假","培训机会"]', 'active', 940, 36, '2023-12-19', '2023-12-19');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job29', '技术文档工程师', 'company5', '技术文档', '普莱诺', 'TX', 70000, 95000, 'yearly', '1-3年', '本科', '负责技术文档编写和维护。', '["技术写作经验","技术背景","工具熟练","英文流利"]', '["五险一金","股票期权","住房补贴","培训机会"]', 'active', 520, 14, '2023-12-18', '2023-12-18');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job30', 'UX研究员', 'company6', 'UX研究', '圣何塞', 'CA', 90000, 130000, 'yearly', '1-3年', '硕士', '负责用户研究和体验分析。', '["研究方法","数据分析","报告撰写","心理学背景"]', '["五险一金","员工优惠","带薪年假","团队建设"]', 'active', 780, 24, '2023-12-17', '2023-12-17');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job31', '客户成功经理', 'company3', '客户成功', '圣克拉拉', 'CA', 85000, 120000, 'yearly', '3-5年', '本科', '负责客户成功和续约管理。', '["SaaS经验","客户管理","数据分析","演讲能力"]', '["五险一金","年终奖","带薪年假","培训机会"]', 'active', 820, 28, '2023-12-16', '2023-12-16');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job32', '商业智能分析师', 'company2', '商业智能', '洛杉矶', 'CA', 95000, 135000, 'yearly', '3-5年', '本科', '负责商业智能和数据分析。', '["Tableau/PowerBI","SQL熟练","数据建模","商业敏感度"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 880, 31, '2023-12-15', '2023-12-15');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job33', '法务专员', 'company1', '法务', '帕洛阿尔托', 'CA', 90000, 130000, 'yearly', '1-3年', '博士', '负责公司法律事务处理。', '["JD学位","律师执业证","公司法经验","中英文"]', '["五险一金","带薪年假","弹性工作","股票期权"]', 'active', 640, 16, '2023-12-14', '2023-12-14');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job34', '司机', 'company4', '司机', '兰卡斯特', 'CA', 18, 25, 'hourly', '不限', '高中', '负责公司员工班车驾驶。', '["CDL驾照","驾驶记录良好","熟悉路线","服务意识"]', '["五险一金","加班费","工作餐","制服"]', 'active', 1120, 68, '2023-12-13', '2023-12-13');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job35', '仓库管理员', 'company4', '仓库管理', '兰卡斯特', 'CA', 40000, 55000, 'yearly', '1-3年', '高中', '负责仓库日常管理工作。', '["仓库经验","Forklift证","盘点经验","体力好"]', '["五险一金","加班费","工作餐","保险"]', 'active', 780, 34, '2023-12-12', '2023-12-12');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job36', '餐饮服务员', 'company6', '餐饮服务', '圣何塞', 'CA', 15, 20, 'hourly', '不限', '不限', '负责餐厅顾客服务工作。', '["服务意识","英语基础","健康证","团队合作"]', '["小费","员工餐","弹性排班","培训"]', 'active', 1340, 89, '2023-12-11', '2023-12-11');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job37', '零售导购', 'company6', '零售导购', '圣何塞', 'CA', 14, 18, 'hourly', '不限', '高中', '负责门店商品销售工作。', '["销售意识","服务态度","中英文","站立工作"]', '["提成","员工折扣","培训","晋升机会"]', 'active', 980, 62, '2023-12-10', '2023-12-10');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job38', '建筑工人', 'company9', '建筑工人', '芝加哥', 'IL', 20, 28, 'hourly', '不限', '不限', '负责建筑施工相关工作。', '["体力好","户外工作","安全意识","团队合作"]', '["加班费","保险","住宿","工作餐"]', 'active', 890, 56, '2023-12-09', '2023-12-09');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job39', '电工', 'company9', '电工', '芝加哥', 'IL', 25, 35, 'hourly', '3-5年', '高中', '负责电气设备安装维护。', '["电工证","电气知识","安全意识","读图能力"]', '["加班费","保险","住宿","培训"]', 'active', 720, 31, '2023-12-08', '2023-12-08');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job40', '教师', 'company2', '教师', '洛杉矶', 'CA', 50000, 70000, 'yearly', '1-3年', '本科', '负责中文教学工作。', '["教学经验","普通话标准","耐心负责","创意教学"]', '["五险一金","寒暑假","培训","晋升"]', 'active', 1120, 47, '2023-12-07', '2023-12-07');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job41', 'Tutor', 'company2', 'Tutor', '洛杉矶', 'CA', 25, 40, 'hourly', '不限', '本科', '负责一对一辅导工作。', '["学科基础","教学能力","耐心","时间灵活"]', '["时薪高","时间灵活","远程","选择客户"]', 'active', 1450, 78, '2023-12-06', '2023-12-06');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job42', '护士', 'company8', '护士', '新泽西州', 'NJ', 65000, 85000, 'yearly', '1-3年', '本科', '负责患者护理工作。', '["RN执照","BLS认证","护理经验","责任心"]', '["五险一金","轮班补贴","培训","晋升"]', 'active', 890, 35, '2023-12-05', '2023-12-05');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job43', '医疗助理', 'company8', '医疗助理', '新泽西州', 'NJ', 40000, 55000, 'yearly', '1年以下', '大专', '协助医生完成医疗工作。', '["CMA认证","医疗知识","服务意识","细心"]', '["五险一金","培训","工作服","假期"]', 'active', 720, 28, '2023-12-04', '2023-12-04');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job44', '旅行社顾问', 'company9', '旅游顾问', '芝加哥', 'IL', 45000, 65000, 'yearly', '1-3年', '本科', '为客户提供旅游咨询服务。', '["旅游知识","销售能力","中英文","服务意识"]', '["五险一金","旅游优惠","提成","培训"]', 'active', 640, 22, '2023-12-03', '2023-12-03');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job45', '快递员', 'company3', '快递员', '圣克拉拉', 'CA', 18, 24, 'hourly', '不限', '高中', '负责包裹配送工作。', '["驾照","体力好","时间观念","服务态度"]', '["加班费","保险","小费","灵活"]', 'active', 1680, 112, '2023-12-02', '2023-12-02');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job46', '平面设计师', 'company1', '平面设计', '帕洛阿尔托', 'CA', 65000, 90000, 'yearly', '1-3年', '本科', '负责品牌视觉设计工作。', '["设计软件熟练","作品集","创意能力","品牌意识"]', '["五险一金","带薪年假","弹性工作","设备"]', 'active', 920, 34, '2023-12-01', '2023-12-01');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job47', '视频剪辑师', 'company2', '视频剪辑', '洛杉矶', 'CA', 55000, 80000, 'yearly', '1-3年', '本科', '负责短视频内容剪辑制作。', '["剪辑软件","创意思维","节奏感","短视频经验"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 1180, 52, '2023-11-30', '2023-11-30');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job48', '社交媒体专员', 'company2', '社交媒体', '洛杉矶', 'CA', 50000, 75000, 'yearly', '1年以下', '本科', '负责社交媒体内容运营。', '["熟悉社媒平台","文案能力","热点敏感","数据分析"]', '["五险一金","免费三餐","健身房","弹性工作"]', 'active', 1340, 64, '2023-11-29', '2023-11-29');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job49', '会计', 'company10', '会计', '纽约', 'NY', 60000, 85000, 'yearly', '1-3年', '本科', '负责日常会计核算工作。', '["会计基础","Excel熟练","细心","CPA优先"]', '["五险一金","年终奖","培训","晋升"]', 'active', 780, 29, '2023-11-28', '2023-11-28');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job50', '税务专员', 'company10', '税务', '纽约', 'NY', 65000, 90000, 'yearly', '1-3年', '本科', '负责税务申报和筹划工作。', '["税务知识","EA/CPA","软件熟练","中英文"]', '["五险一金","年终奖","培训","晋升"]', 'active', 620, 19, '2023-11-27', '2023-11-27');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job51', '理疗师', 'company8', '理疗师', '新泽西州', 'NJ', 70000, 95000, 'yearly', '1-3年', '硕士', '负责患者理疗康复工作。', '["PT执照","认证","经验","责任心"]', '["五险一金","培训","保险","假期"]', 'active', 520, 14, '2023-11-26', '2023-11-26');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job52', '牙医助理', 'company8', '牙医助理', '新泽西州', 'NJ', 45000, 60000, 'yearly', '1年以下', '大专', '协助牙医完成诊疗工作。', '["DA认证","牙科知识","服务意识","细心"]', '["五险一金","培训","工作服","假期"]', 'active', 580, 21, '2023-11-25', '2023-11-25');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job53', '风控专员', 'company10', '风控', '纽约', 'NY', 80000, 110000, 'yearly', '3-5年', '硕士', '负责风险控制和合规工作。', '["风控经验","金融背景","分析能力","合规知识"]', '["五险一金","年终奖","培训","晋升"]', 'active', 540, 15, '2023-11-24', '2023-11-24');

INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('job54', '审计师', 'company10', '审计', '纽约', 'NY', 75000, 100000, 'yearly', '1-3年', '本科', '负责内部审计工作。', '["审计经验","CPA优先","细心","沟通能力"]', '["五险一金","年终奖","培训","晋升"]', 'active', 490, 12, '2023-11-23', '2023-11-23');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('tech', '技术类', '💻', 'tech');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('design', '设计类', '🎨', 'design');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('marketing', '市场类', '📊', 'marketing');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('finance', '金融类', '💰', 'finance');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('medical', '医疗类', '🏥', 'medical');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('education', '教育类', '📚', 'education');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('service', '服务类', '🛎️', 'service');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('construction', '建筑类', '🏗️', 'construction');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('logistics', '物流类', '🚚', 'logistics');

INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('admin', '行政类', '📋', 'admin');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('ca', '加利福尼亚州', NULL, 'CA', '["洛杉矶","旧金山","圣何塞","圣地亚哥","萨克拉门托","弗雷斯诺","奥克兰"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('ny', '纽约州', NULL, 'NY', '["纽约市","水牛城","罗切斯特","奥尔巴尼","雪城"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('tx', '德克萨斯州', NULL, 'TX', '["休斯顿","达拉斯","奥斯汀","圣安东尼奥","沃斯堡"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('fl', '佛罗里达州', NULL, 'FL', '["迈阿密","奥兰多","坦帕","杰克逊维尔"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('il', '伊利诺伊州', NULL, 'IL', '["芝加哥","奥罗拉","纳珀维尔"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('pa', '宾夕法尼亚州', NULL, 'PA', '["费城","匹兹堡","阿伦敦"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('wa', '华盛顿州', NULL, 'WA', '["西雅图","斯波坎","塔科马"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('ma', '马萨诸塞州', NULL, 'MA', '["波士顿","伍斯特","斯普林菲尔德"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('ga', '乔治亚州', NULL, 'GA', '["亚特兰大","奥古斯塔","萨凡纳"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('nj', '新泽西州', NULL, 'NJ', '["纽瓦克","泽西市","帕特森"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('nv', '内华达州', NULL, 'NV', '["拉斯维加斯","里诺","亨德森"]');

INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('az', '亚利桑那州', NULL, 'AZ', '["凤凰城","图森","梅萨"]');