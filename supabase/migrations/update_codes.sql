-- Add the 'code' column if it doesn't exist
ALTER TABLE universities ADD COLUMN IF NOT EXISTS code VARCHAR(20);

-- Populate codes for existing universities
UPDATE universities SET code = 'NCNT' WHERE id = 'aa473abf-85a0-4803-b997-508febbb0441'; -- National Center for Nanoscience and Technology
UPDATE universities SET code = 'HIT' WHERE id = '09b8dc08-e813-486b-9664-c12ed788c1ad'; -- Harbin Institute of Technology
UPDATE universities SET code = 'HUST' WHERE id = '862e3ef5-0c59-4c7d-b725-47cd7aed06e8'; -- Henan University of Science & Technology
UPDATE universities SET code = 'YUFE' WHERE id = '27529d81-99b6-4481-b31f-30b693c1e706'; -- Yunnan University of Finance and Economics
UPDATE universities SET code = 'HUAS' WHERE id = 'eb563895-0c69-4fd1-b8ae-63f2a27b06d6'; -- Hubei University of Arts and Science
UPDATE universities SET code = 'SUPSL' WHERE id = '6825cb54-9214-46c2-9c30-080de2e41f2d'; -- Southwest University of Political Science & Law
UPDATE universities SET code = 'ZU' WHERE id = '2dc8458d-7fc6-4965-b7d7-52eaf69c21c9'; -- Zhejiang University
UPDATE universities SET code = 'SFMU' WHERE id = 'e2090d8a-3fc9-4af1-ab19-eea13cac8865'; -- Shandong First Medical University
UPDATE universities SET code = 'ZUT' WHERE id = '81fbe816-8351-4765-ae0c-537de7f169ab'; -- Zhejiang University of Technology
UPDATE universities SET code = 'NU' WHERE id = '76cd3a3b-2758-4503-bc66-2368e34afca0'; -- Nanchang University
UPDATE universities SET code = 'ZUT1' WHERE id = '67dd1d44-6db4-47cc-a700-1c599336601c'; -- Zhongyuan University of Technology
UPDATE universities SET code = 'SUMC' WHERE id = 'a4727975-1fc6-4be7-abd3-048555c746cf'; -- Shantou University Medical College
UPDATE universities SET code = 'SUFE' WHERE id = '492b97cb-c42a-436a-a046-54c720ffa5a4'; -- Southwestern University of Finance and Economics
UPDATE universities SET code = 'HUST1' WHERE id = '4c260572-9820-4d73-9ffc-9820a3e8cba8'; -- Harbin University of Science and Technology
UPDATE universities SET code = 'LCU' WHERE id = '006fd10e-d81d-4884-9046-3cb63e23bf91'; -- Liaoning Communication University
UPDATE universities SET code = 'NMU' WHERE id = '0aa700ad-5452-465d-844d-786be9686286'; -- Ningxia Medical University
UPDATE universities SET code = 'SUTCM' WHERE id = '1577f902-4022-49b0-b27e-01d83b6263ab'; -- Shandong University of Traditional Chinese Medicine
UPDATE universities SET code = 'SCUT' WHERE id = '6fa9ffb9-3389-4ad6-8202-4fce4a9fa3bd'; -- South China University of Technology
UPDATE universities SET code = 'TUTCM' WHERE id = '76b0c6d1-0ce9-49a1-91c9-ecf97983c177'; -- Tianjin University of Traditional Chinese Medicine
UPDATE universities SET code = 'ZUFE' WHERE id = 'f7d46033-6611-4eff-9c78-d7950e6dcad8'; -- Zhejiang University of Finance and Economics
UPDATE universities SET code = 'GUFE' WHERE id = '2d5519f6-2015-4186-81b6-8eb3c652b2e2'; -- Guangdong University of Finance & Economics
UPDATE universities SET code = 'GNU' WHERE id = 'b2e89e0a-6fb6-4b69-a07a-fc1dcc9a3ff0'; -- Guangxi Normal University
UPDATE universities SET code = 'DUT' WHERE id = '6babeb53-e84d-4a5b-b6ab-2ff9fa094a30'; -- Dongguan University of Technology
UPDATE universities SET code = 'NFU' WHERE id = '6077e7ae-b601-4e0d-ae80-2246c15ea371'; -- Nanjing Forestry University
UPDATE universities SET code = 'XJLU' WHERE id = 'd1c4b7d2-6b68-41cd-b231-8d55f2d0414a'; -- Xi''an Jiaotong-Liverpool University
UPDATE universities SET code = 'NUST' WHERE id = '5ad6305a-523a-4435-92a3-d5dd3f2cca42'; -- Nanjing University of Science and Technology
UPDATE universities SET code = 'NSMC' WHERE id = '4c8ce820-469c-475c-956f-68389b679fcf'; -- North Sichuan Medical College
UPDATE universities SET code = 'SUST' WHERE id = 'e0590a95-2459-4167-96fc-8f22fa087f87'; -- Shandong University of Science & Technology
UPDATE universities SET code = 'SUT' WHERE id = 'a7dc22ab-0c7c-48f4-8596-c579de7adbbf'; -- Shandong University of Technology (SDUT)
UPDATE universities SET code = 'TUSM' WHERE id = '89d742e0-6727-4613-8ed4-05acb0ac6416'; -- Tongji University School of Medicine
UPDATE universities SET code = 'USTL' WHERE id = 'b17e25cf-6e53-4e33-8fee-6808600c14c9'; -- University of Science and Technology Liaoning
UPDATE universities SET code = 'NFU1' WHERE id = 'fce09ae5-a6a2-4356-8ef3-46563b2f6fdd'; -- Northeast Forestry University
UPDATE universities SET code = 'CCAACU' WHERE id = 'bf7a0436-44a4-4db7-8489-763db78c2289'; -- College of Chinese & ASEAN Arts, Chengdu University
UPDATE universities SET code = 'YNU' WHERE id = 'f5b68140-b0b8-4aef-9d78-0727f8ba7ed1'; -- Yunnan Normal University
UPDATE universities SET code = 'FMU' WHERE id = 'ae29adbc-09f1-42f4-a514-6236076a3644'; -- Fujian Medical University
UPDATE universities SET code = 'GUCM' WHERE id = '582094d0-c84c-49f3-ac35-692c6eed0d09'; -- Guangxi University of Chinese Medicine
UPDATE universities SET code = 'ZAFU' WHERE id = 'b0e30e22-1dd7-4d55-8a5e-4c576d617ecf'; -- Zhejiang A & F University
UPDATE universities SET code = 'LUC' WHERE id = '50e2249c-222f-4d0d-b52f-52969ad6a1fc'; -- Lincoln University College (Malaysia)
UPDATE universities SET code = 'NPU' WHERE id = 'ec76a177-f351-4936-a7e1-30853b3eefe3'; -- Northwestern Polytechnical University
UPDATE universities SET code = 'LU' WHERE id = '59ff0f2c-fd73-4063-8364-9b057977bfbc'; -- Lishui University
UPDATE universities SET code = 'ECUST' WHERE id = 'b6a87330-7e0c-4c65-8f51-07af81e6ec57'; -- East China University of Science and Technology
UPDATE universities SET code = 'NPU1' WHERE id = '94caf2bd-66c3-4a18-ab2d-ee2098e7dbe2'; -- Northeast Petroleum University
UPDATE universities SET code = 'OUC' WHERE id = '0b00caf3-5e4e-47fc-9ef8-8f8b8a7077a7'; -- Ocean University of China
UPDATE universities SET code = 'ZU1' WHERE id = '96ff52d6-def7-43bf-badd-d923ffe7ed9d'; -- Zhengzhou University
UPDATE universities SET code = 'TU' WHERE id = '0f81d499-8f10-47b9-940c-7c4a7828ef38'; -- Tiangong University
UPDATE universities SET code = 'GUCM1' WHERE id = 'bfb9a129-c0aa-49f3-82e5-16caee649c6f'; -- Guangzhou University of Chinese Medicine
UPDATE universities SET code = 'SLU' WHERE id = 'a4618a66-45c9-4360-9032-30b7e072da4d'; -- Shenyang Ligong University
UPDATE universities SET code = 'EBS' WHERE id = '29447803-9273-44d8-be43-6032e1f314f6'; -- ENAE Business School
UPDATE universities SET code = 'UCA' WHERE id = '27ace795-5d4f-40af-b51d-73c49631636a'; -- UCAM
UPDATE universities SET code = 'BS' WHERE id = '1cfbc4ac-708f-46e4-a311-d9a39d829e8a'; -- BLC Spain
UPDATE universities SET code = 'CBSB' WHERE id = 'd9ea7950-f4f8-4d00-9b18-150f938932eb'; -- C3S Business School Barcelona 
UPDATE universities SET code = 'EIBSB' WHERE id = '4f8e457d-8dae-4181-949e-2efe30e802ab'; -- ESEI International Business school Barcelona
UPDATE universities SET code = 'HUT' WHERE id = '1559a715-8125-4810-af12-d95ad245f913'; -- Henan University of Technology
UPDATE universities SET code = 'NU1' WHERE id = 'dcffef2d-d8d1-4f0a-9f38-7882a2b0aa58'; -- Nanjing University
UPDATE universities SET code = 'NUFE' WHERE id = 'adc9f49f-ae12-454b-beab-77d05b12f9d9'; -- Nanjing University of Finance and Economics
UPDATE universities SET code = 'HEU' WHERE id = 'ae30068b-81dc-4218-a06e-c39db266b4e0'; -- Harbin Engineering University
UPDATE universities SET code = 'ZGU' WHERE id = '8b4f1ffd-8aa1-4811-a9bb-9df634995739'; -- Zhejiang Gongshang University
UPDATE universities SET code = 'IB' WHERE id = '6475dc19-ad5d-4557-93bf-a67b53e74eac'; -- IED Barcelona
UPDATE universities SET code = 'TU1' WHERE id = '07f8ac2d-7f2c-45eb-a2ef-456d131c5847'; -- Tianjin University
UPDATE universities SET code = 'CUPB' WHERE id = 'a3370ea4-36ba-4589-8019-ecbef1bce32d'; -- China University of Petroleum （Beijing）
UPDATE universities SET code = 'BU' WHERE id = '32e2e4bf-0642-4a4f-a907-4b8d63f94d88'; -- Bohai University
UPDATE universities SET code = 'HU' WHERE id = '1dafe9c0-ed41-42d2-a34b-fd6e6afaf86f'; -- Heilongjiang University
UPDATE universities SET code = 'HIT1' WHERE id = 'c33fbd54-98d8-456a-b6c3-bdb135b69df1'; -- Huaiyin Institute of Technology
UPDATE universities SET code = 'XU' WHERE id = '9ba339bf-f7d3-4da9-9e75-e1c7ca606c80'; -- Xidian University
UPDATE universities SET code = 'BNU' WHERE id = '3f8cc042-956d-459b-aa45-9375a7502e1c'; -- Beijing Normal University
UPDATE universities SET code = 'CTU' WHERE id = '320514fe-82df-4a37-a01c-74a07e73b3a6'; -- Chengdu Technological University
UPDATE universities SET code = 'CUFE' WHERE id = '2599a616-b613-44bc-a61f-3c1fa1ce5eb5'; -- Central University of Finance and Economics
UPDATE universities SET code = 'HUST2' WHERE id = 'c45866cf-7776-4419-9a79-c182aadd56eb'; -- Huazhong University of Science and Technology
UPDATE universities SET code = 'ZISU' WHERE id = 'c6aa98c9-0e68-4fc0-9807-eb685381a30a'; -- Zhejiang International Studies University (ZISU)
UPDATE universities SET code = 'BP' WHERE id = 'bbf99c80-79c4-4179-ba53-2f88310f34d3'; -- Beijing Polytechnic
UPDATE universities SET code = 'CMU' WHERE id = '4cd81b3b-01d2-4b4f-9239-084bec156162'; -- China Medical University
UPDATE universities SET code = 'QUST' WHERE id = 'b56eeb9d-aa6f-4113-8708-7cf09b04fb4d'; -- Qingdao University of Science and Technology
UPDATE universities SET code = 'ZUST' WHERE id = 'e0c5f5fd-5880-4d3f-b761-04adeb0d734f'; -- Zhejiang University of Science and Technology
UPDATE universities SET code = 'HIT2' WHERE id = 'cf30838d-aa40-48ce-8636-8f93a5d249c4'; -- Harbin Institute of Technology(shenzhen)
UPDATE universities SET code = 'BUT' WHERE id = 'e7be3976-dcd7-4dd7-9ddd-ddba4465d838'; -- Beijing University of Technology
UPDATE universities SET code = 'CU' WHERE id = '7ee6cf36-f368-4dfb-8a31-4a98c6f87404'; -- Chang''an University
UPDATE universities SET code = 'DMU' WHERE id = '4494d03e-9b81-4e11-8c21-461693252fbe'; -- Dalian Maritime University
UPDATE universities SET code = 'SISU' WHERE id = '00817a19-bcdf-4809-8140-c3fc4cde85cb'; -- Shanghai International Studies University
UPDATE universities SET code = 'BJU' WHERE id = '6cae873d-a089-43cf-b632-47368cecf45a'; -- Beijing Jiaotong University
UPDATE universities SET code = 'BSU' WHERE id = 'ad450a1e-f523-4e66-a11e-b057162e9929'; -- Beijing Sport University
UPDATE universities SET code = 'BUCM' WHERE id = '7dbdb6ab-9dda-4a89-8a96-e48449a49ce8'; -- Beijing University of Chinese Medicine
UPDATE universities SET code = 'SU' WHERE id = '4cd903b8-5421-423e-937d-752f12a36c74'; -- Shaoxing University
UPDATE universities SET code = 'CU1' WHERE id = '2f80da67-04bf-43e1-8e6e-8b441d08684c'; -- Chifeng University
UPDATE universities SET code = 'CUZ' WHERE id = '42d87ffb-103f-41c0-9de7-464a324fb170'; -- Communication University of Zhejiang
UPDATE universities SET code = 'DUFL' WHERE id = '042dc220-7eb7-447b-b578-85ead73c498c'; -- Dalian University of Foreign Languages
UPDATE universities SET code = 'GMU' WHERE id = '019c3d34-693d-489e-8ce1-4beaf28b93cb'; -- Guizhou Medical University
UPDATE universities SET code = 'SPU' WHERE id = 'e55e09e7-7546-4d77-9fd9-df0333637b47'; -- Shanghai Polytechnic University
UPDATE universities SET code = 'ZUEL' WHERE id = 'bab6ceb5-3e93-4945-996d-dec7b774e446'; -- Zhongnan University of Economics and Law
UPDATE universities SET code = 'DMU1' WHERE id = '44838c60-b02a-4c3b-8a2c-c6e9847a278f'; -- Dalian Medical University
UPDATE universities SET code = 'HCPC' WHERE id = '51be311e-3b5d-49c2-8d8b-1b04b4fbf489'; -- Hebei Chemical & Pharmaceutical College
UPDATE universities SET code = 'HFU' WHERE id = '7ec24f60-33e1-4934-a57e-d394d8ae6166'; -- Hebei Finance University
UPDATE universities SET code = 'HPUT' WHERE id = '2680a5ef-21de-424d-ba60-d0d0bf0f641b'; -- Hebei Petroleum University of Technology
UPDATE universities SET code = 'CUPB1' WHERE id = '7fcf4419-3d89-4060-b534-9d975916075b'; -- China University of Petroleum - Beijing
UPDATE universities SET code = 'MIUC' WHERE id = '265efe11-90bd-4eab-9969-ee2315195146'; -- (MIUC) Marbella international university centre
UPDATE universities SET code = 'DPU' WHERE id = '07e11ad8-8b54-400f-a278-190375903728'; -- Dalian Polytechnic University
UPDATE universities SET code = 'HITS' WHERE id = '4d61a24a-2b80-4a60-a7a0-7e8a928b175f'; -- Harbin Institute of Technology, Shenzhen
UPDATE universities SET code = 'HGU' WHERE id = '9291f7b8-4919-4df2-8ebe-2b89250b9a09'; -- Hebei GEO University
UPDATE universities SET code = 'HU1' WHERE id = '835421b1-c800-4e9b-b486-48fae3fcde1e'; -- Hebei University
UPDATE universities SET code = 'CUC' WHERE id = '00418cec-ceaa-45ea-8a86-39aac38db40e'; -- Communication University of China
UPDATE universities SET code = 'HDU' WHERE id = '5d21f4e2-2f49-4412-90df-e8c8d9ec463e'; -- Hangzhou Dianzi University
UPDATE universities SET code = 'AMU' WHERE id = '2ba23fae-32fe-457b-bb6c-b08448736bcd'; -- Anhui Medical University
UPDATE universities SET code = 'HMU' WHERE id = '525aca18-520d-4847-93ad-c827d799a16d'; -- Hebei Medical University
UPDATE universities SET code = 'HU2' WHERE id = '5799f06b-6f65-48ca-8a50-1f66dd424c4f'; -- Henan University
UPDATE universities SET code = 'LIST' WHERE id = '3ed3c320-6610-4311-92fc-423c2be6f13b'; -- Liaoning Institute of Science and Technology
UPDATE universities SET code = 'SUSBS' WHERE id = 'f6d0587d-573b-4546-a386-87ed15513c1b'; -- Shanghai University-SILC BUSINESS SCHOOL
UPDATE universities SET code = 'HNU' WHERE id = '645e9deb-142c-4827-8b4e-fec8bd574b9b'; -- Harbin Normal University
UPDATE universities SET code = 'ANU' WHERE id = '57e63fd9-a1fe-437f-bd9f-56a13a981b54'; -- Anhui Normal University
UPDATE universities SET code = 'SAU' WHERE id = '70733d16-906a-48fc-a497-25f8ee10bb32'; -- Shenyang Aerospace University
UPDATE universities SET code = 'SLUAF' WHERE id = '763876e0-0581-40e0-a362-ac042c169055'; -- Shanghai Lixin University of Accounting and Finance 
UPDATE universities SET code = 'WMU' WHERE id = '544dc1a0-b429-4d62-920d-0121e3701593'; -- Wenzhou Medical University
UPDATE universities SET code = 'UNNC' WHERE id = '43f6bb44-5fea-4d9d-a21e-3a5e27b373f5'; -- University of Nottingham Ningbo China
UPDATE universities SET code = 'HUST3' WHERE id = '340c2590-4e1d-490b-b3d7-f073a03056ea'; -- Hunan University of Science and Technology
UPDATE universities SET code = 'KMU' WHERE id = 'b0bac8b3-9020-4eb4-88f2-2e1ec6990b69'; -- Kunming Medical University
UPDATE universities SET code = 'LVTC' WHERE id = '81fbbefb-a4e9-4d21-bd93-a137f5b2bb32'; -- Leshan Vocational and Technical College
UPDATE universities SET code = 'AEBSECNU' WHERE id = '4367d26a-e883-4790-b814-35fb7e747f61'; -- Asia Europe Business School, East China Normal University
UPDATE universities SET code = 'HAU' WHERE id = '0969bd7e-a786-41ab-a5a1-d3ef4ce3cc31'; -- Hunan Agricultural University
UPDATE universities SET code = 'JU' WHERE id = '45cdee46-eda6-4616-b427-32dae03e2e61'; -- Jiangnan University
UPDATE universities SET code = 'JIT' WHERE id = '55bb6bda-8911-4a02-add8-3876f09d46d3'; -- Jinling Institute of Technology
UPDATE universities SET code = 'BU1' WHERE id = 'e4ff9365-812f-47a8-bf68-0a16f5413568'; -- Beihang University
UPDATE universities SET code = 'CUG' WHERE id = '09ce5e0e-c5b2-4d5a-a93d-e96615e27bba'; -- China University of Geosciences (Wuhan)
UPDATE universities SET code = 'HU3' WHERE id = '48a3143a-2a28-4cc0-811b-a8d30fc029c7'; -- Herzen University(Russia)
UPDATE universities SET code = 'IM' WHERE id = 'beddfd7f-a8f3-4906-8039-2348f0ccc1da'; -- Instant Mandarin
UPDATE universities SET code = 'MH' WHERE id = '8aab67d1-70e3-4784-9818-50abfb8e745c'; -- Mandarin House
UPDATE universities SET code = 'BDA' WHERE id = '662f2b73-47a2-462d-8ca2-0c7cb475eaee'; -- Beijing Dance Academy
UPDATE universities SET code = 'MUC' WHERE id = 'c24eda0e-2640-4313-9caf-8e36a4776c75'; -- MinZu University of China
UPDATE universities SET code = 'JUVT' WHERE id = '2418e95a-c25d-4194-886d-c9facf943002'; -- Jinhua University of Vocational Technology
UPDATE universities SET code = 'NUFE1' WHERE id = '89122459-7c43-402c-a95d-155260b869a8'; -- Nanjing University of Finance & Economics
UPDATE universities SET code = 'PU' WHERE id = 'b8c491e0-27aa-4d18-b432-1d12e3cbe7a3'; -- Peking University
UPDATE universities SET code = 'JVCM' WHERE id = 'da0781cb-9767-49ba-94e8-fca06e4b07b1'; -- Jiangsu Vocational College of Medicine
UPDATE universities SET code = 'LNU' WHERE id = '0423a26b-e4fb-4eae-bd8a-2243bf78bad6'; -- Liaoning Normal University
UPDATE universities SET code = 'LUT' WHERE id = 'fc612ebd-f99f-48f4-a933-b12d0ea758d3'; -- Liaoning University of Technology
UPDATE universities SET code = 'LUC1' WHERE id = 'fa342dd8-6618-40b9-a799-6e81b2f8c6e0'; -- Lincoln University College
UPDATE universities SET code = 'LUC2' WHERE id = '51a004e2-9918-48e5-8ee2-12c696071937'; -- Lincoln University College(Malaysia)
UPDATE universities SET code = 'LNU1' WHERE id = '69c97c90-c736-454e-9892-6ff117cdb790'; -- Lingnan Normal University
UPDATE universities SET code = 'NAU' WHERE id = '4b3d9ae2-ad78-4a27-adfe-d35772f3df38'; -- Northeast Agricultural University
UPDATE universities SET code = 'NU2' WHERE id = '056a7074-b77d-4e69-a583-c9bb73d6d214'; -- Northwest University
UPDATE universities SET code = 'SDU' WHERE id = 'd288ca6b-4654-420d-9d7c-ac0e65aae15e'; -- Shanghai Dianji University
UPDATE universities SET code = 'SU1' WHERE id = '484c3972-974d-4e90-a009-d3f7a6adb026'; -- Shantou University
UPDATE universities SET code = 'BFA' WHERE id = '4b987180-ed97-45d0-957c-902e34df4db7'; -- Beijing Film Academy
UPDATE universities SET code = 'NU3' WHERE id = '41e3ca26-3031-4eb7-bd8a-a3bf0efe03a2'; -- Ningxia University
UPDATE universities SET code = 'QTU' WHERE id = '9bdc000c-4a23-4bda-b0a8-799c93c1a65e'; -- Qingdao Technological University
UPDATE universities SET code = 'SFMU1' WHERE id = 'dc8d5ae5-549f-4b6c-b2b9-60a344dfb6f8'; -- Shandong First Medical University(Shandong Academy Of Medical Sciences)
UPDATE universities SET code = 'SUT1' WHERE id = 'f718ab27-21d2-40a7-af8b-e6f4c1a6b6c6'; -- Shandong University of Technology
UPDATE universities SET code = 'GU' WHERE id = 'adbf07f0-7c4a-453a-8d69-7d0916043460'; -- Guangxi University
UPDATE universities SET code = 'NVUIT' WHERE id = 'b9e8de95-a506-4690-a557-aed14203e93a'; -- Nanjing Vocational University of Industry Technology
UPDATE universities SET code = 'NUQ' WHERE id = '1f52d5d4-72e3-49cc-b0b8-1f7bd06f65bd'; -- Northeastern University at Qinhuangdao
UPDATE universities SET code = 'RUC' WHERE id = '8052fbb9-8651-4577-9425-993dd49d41a6'; -- Renmin University of China
UPDATE universities SET code = 'BFSU' WHERE id = 'be000d10-f911-4249-a173-d673da1ef94c'; -- Beijing Foreign Studies University
UPDATE universities SET code = 'SCM' WHERE id = '76396be3-7ab6-414c-ab17-a9a89fce49f0'; -- Shanghai Conservatory of Music
UPDATE universities SET code = 'SUTCM1' WHERE id = 'a6a40e7a-e40d-4a17-a3b3-23eb50f19178'; -- Shanghai University of Traditional Chinese Medicine
UPDATE universities SET code = 'SUA' WHERE id = '0e97b688-4e1a-4a27-b196-56fb40fd3be7'; -- Shandong University of Arts
UPDATE universities SET code = 'TU2' WHERE id = '451520c1-b3b5-4b0c-a78c-7aea55be1c9d'; -- Tongji University
UPDATE universities SET code = 'QU' WHERE id = '932633d2-77b6-4d3b-b5fc-bc825a467fa3'; -- Qingdao University
UPDATE universities SET code = 'SJU' WHERE id = 'f04607a6-b75f-42e9-8882-cf873ca62de9'; -- Shandong Jianzhu University
UPDATE universities SET code = 'SWCVC' WHERE id = 'efc19f98-68cd-473e-9886-4a7afe4b4ef8'; -- Shandong Water Conservancy Vocational College
UPDATE universities SET code = 'SUFE1' WHERE id = 'd00ed901-a0f1-4e2e-9533-264d9298224b'; -- Shanghai University of Finance and Economics
UPDATE universities SET code = 'SNU' WHERE id = 'eef053d6-dcc1-43dd-83da-5e33854d1ad0'; -- Shanxi Normal University
UPDATE universities SET code = 'NNU' WHERE id = '5d0ad847-4005-434d-b712-7a313d5de3aa'; -- Nanjing Normal University
UPDATE universities SET code = 'SPC' WHERE id = 'e5be91de-a999-44cb-b8fa-c1ed4695446a'; -- Shandong Polytechnic College
UPDATE universities SET code = 'SOU' WHERE id = '76c19457-27fa-4c4f-96dc-140bf9edc6ab'; -- Shanghai Ocean University
UPDATE universities SET code = 'SUPSL1' WHERE id = '05084bcf-cab9-48a1-b0a5-44ca90f67678'; -- Shanghai University Of Political Science and Law
UPDATE universities SET code = 'SBS' WHERE id = '855b2d6d-44c1-46b8-a92f-f9b5187ee466'; -- Shanghai Business School
UPDATE universities SET code = 'SUTCM2' WHERE id = '95302e57-29b0-4545-b0c2-7a8bedaf0ec0'; -- Shanxi University of Traditional Chinese Medicine
UPDATE universities SET code = 'SUCT' WHERE id = 'ed58a69e-81b7-42b3-8b5a-08ab051f2810'; -- Shenyang University of Chemical Technology
UPDATE universities SET code = 'BUCT' WHERE id = 'cfaf1262-ed5c-4247-8939-51785ddb5454'; -- Beijing University of Chemical Technology
UPDATE universities SET code = 'SCU' WHERE id = '2c95e324-aafa-45ec-8cf1-4af7626864ee'; -- Shenyang City University
UPDATE universities SET code = 'SU2' WHERE id = 'd4b4ed6c-2a53-422a-8e0a-0d5c160a1f8c'; -- Shihezi University
UPDATE universities SET code = 'SUSE' WHERE id = 'b7f6d0ab-6328-4a63-b118-3a33830bb6d0'; -- Sichuan University of Science and Engineering
UPDATE universities SET code = 'SMU' WHERE id = '461e386f-bbcf-4111-b4ba-7eed1a0db07c'; -- Southwest Medical University
UPDATE universities SET code = 'SU3' WHERE id = '9c36218e-f92d-4339-9e47-6f183794dd79'; -- Southwest University
UPDATE universities SET code = 'DU' WHERE id = '12b024be-22d6-46a0-a127-c06aef8b21f5'; -- Donghua University
UPDATE universities SET code = 'GCC' WHERE id = '218524b9-f0eb-4cde-b071-753635fa5f8d'; -- Guangzhou College of Commerce
UPDATE universities SET code = 'SIE' WHERE id = '5bb07fe8-29ac-4b66-9f62-157247b8e9f2'; -- Shenyang Institute of Engineering
UPDATE universities SET code = 'SMC' WHERE id = '0408b904-2c58-424a-9b1b-f837c366c749'; -- Shenyang Medical College
UPDATE universities SET code = 'SU4' WHERE id = '60cb5147-aee5-47c1-8a52-ec0824f0ea44'; -- SIAS University
UPDATE universities SET code = 'SVCIT' WHERE id = 'f6fdc761-97b9-4894-a10d-c370800b69d4'; -- Sichuan Vocational College of Information Technology
UPDATE universities SET code = 'SJU1' WHERE id = 'd32042ca-364d-4dda-897a-58071cf8e442'; -- Shenyang Jianzhu University
UPDATE universities SET code = 'BFSUIBS' WHERE id = 'f664f2a1-23c9-461b-a16a-5b9a4b01d11a'; -- Beijing Foreign Studies University-International Business School
UPDATE universities SET code = 'NCEPU' WHERE id = 'ca45a5b7-e0ca-4380-914b-a9baf03e2b9e'; -- North China Electric Power University
UPDATE universities SET code = 'SU5' WHERE id = 'a6570112-953e-42a5-b4ba-cf89bc49a05f'; -- Shenzhen University
UPDATE universities SET code = 'SU6' WHERE id = '1fc16b4e-2639-4ae9-bf53-223e164aeb7d'; -- Sichuan University
UPDATE universities SET code = 'SMU1' WHERE id = 'fecb5774-5323-44e3-a733-8bbc55c45b0c'; -- Southern Medical University
UPDATE universities SET code = 'SMU2' WHERE id = 'c55b0c18-41d9-4763-8c37-23a141e83d0b'; -- Southwest Minzu University.csv
UPDATE universities SET code = 'SPU1' WHERE id = '9105876a-0559-42fd-9653-e565b82f4b65'; -- Southwest Petroleum University
UPDATE universities SET code = 'SUCU' WHERE id = 'd6bbe8c9-9f99-4153-bc5c-e32cfa866c6b'; -- Shenyang Urban Construction University
UPDATE universities SET code = 'GEPI' WHERE id = '187666df-92dc-4109-be18-0cfeb14ef24c'; -- Guangxi Electrical Polytechnic Institute
UPDATE universities SET code = 'HU4' WHERE id = 'b88202d8-77ca-4d08-852d-b62ca280b4a7'; -- Hainan University
UPDATE universities SET code = 'NHMU' WHERE id = '2b10e9b8-855f-4017-9f2f-008388ef3031'; -- North Henan Medical University
UPDATE universities SET code = 'SISU1' WHERE id = 'f42e9486-ae0d-4a57-8405-520935d094c2'; -- Sichuan International Studies University
UPDATE universities SET code = 'SU7' WHERE id = '6353da9f-209d-4ea9-8851-ecea7921ac2f'; -- Southeast University
UPDATE universities SET code = 'SUST1' WHERE id = '06551902-3fb9-4535-8945-f52b45e10330'; -- Southwest University of Science and Technology
UPDATE universities SET code = 'SPSU' WHERE id = '5dbdae4c-924f-4fb9-935e-20d79cdcb5cb'; -- St Petersburg State University
UPDATE universities SET code = 'SCNU' WHERE id = '573cbe53-c74f-4d12-b333-33d5bad835e7'; -- South China Normal University
UPDATE universities SET code = 'CUHKS' WHERE id = '577b4569-e273-499e-ad5d-97c04e862415'; -- The Chinese University of Hong Kong, Shenzhen
UPDATE universities SET code = 'TICC' WHERE id = '253b17c0-cc0c-48cb-a23f-73f1c1c60e3a'; -- Tianjin International Chinese College
UPDATE universities SET code = 'TMU' WHERE id = '5cadf5c0-5e42-4718-9241-4d74e4641d29'; -- Tianjin Medical University
UPDATE universities SET code = 'TPU' WHERE id = '010b2136-83e1-4474-a2c2-5a562a0a0e56'; -- Tianjin Polytechnic University
UPDATE universities SET code = 'TUFE' WHERE id = '84701e5b-5377-4823-bede-48f1fd246dab'; -- Tianjin University of Finance and Economics
UPDATE universities SET code = 'TUST' WHERE id = 'b93a4a6a-c667-43a1-a417-03654bae2299'; -- Tianjin University of Science & Technology
UPDATE universities SET code = 'TUT' WHERE id = '836e989b-8dcd-45fb-b0bd-e016daef63c5'; -- Tianjin University of Technology
UPDATE universities SET code = 'XAJU' WHERE id = '73772468-f326-40cd-aa49-a6fd50abd656'; -- Xi an Jiaotong University
UPDATE universities SET code = 'BFU' WHERE id = '7f6a7460-304c-4b2a-9d28-b57c595dba9a'; -- Beijing Forestry University
UPDATE universities SET code = 'NNU1' WHERE id = 'c56832b7-e439-4d0e-a445-bd2b7a5ae246'; -- Northeast Normal University
UPDATE universities SET code = 'XCM' WHERE id = '4830000e-fbba-487c-879a-7e61cf465de1'; -- Xi''an Conservatory of Music
UPDATE universities SET code = 'YNU1' WHERE id = '6921f586-cdf1-4b22-8f1b-fa7c162be111'; -- Yangtze Normal University
UPDATE universities SET code = 'XU1' WHERE id = 'ee12dfa3-9608-4342-bf0c-e226954d92a5'; -- Xiangtan University
UPDATE universities SET code = 'YUE' WHERE id = 'abe29453-eac2-4475-ad1e-cd48fbb8f23b'; -- Yinchuan University of Energy
UPDATE universities SET code = 'ZUFE1' WHERE id = '977cc334-0fed-4f28-abd0-f5fa1b9149d9'; -- Zhejiang University of Finance & Economics
UPDATE universities SET code = 'BITC' WHERE id = '133ad6bb-6619-4600-af63-e445e11de134'; -- Beijing Information Technology College
UPDATE universities SET code = 'UIBE' WHERE id = '4ce66440-961a-4be7-b049-82669c604c7b'; -- University of International Business and Economics
UPDATE universities SET code = 'WU' WHERE id = 'fb5dcf3f-3fbc-43bd-9c78-cee5c68798f7'; -- Wenzhou University
UPDATE universities SET code = 'XAJLU' WHERE id = 'b8e774a0-6acb-4933-98a6-a350055ff8df'; -- Xi an Jiaotong-Liverpool University
UPDATE universities SET code = 'XISU' WHERE id = 'fdebb60a-7e07-449a-9294-9e20ad6d6e36'; -- Xi''an International Studies University
UPDATE universities SET code = 'XMU' WHERE id = '9fe5a26d-35b8-4243-ba43-ec98198c8baf'; -- Xinxiang Medical University
UPDATE universities SET code = 'YU' WHERE id = 'b6d0d657-d564-4fa4-a7d3-a83ff54c239f'; -- Yanshan University
UPDATE universities SET code = 'BIEM' WHERE id = 'baf290db-4087-4b06-b1c4-db361a3ec6e5'; -- Beijing Institute of Economics and Management
UPDATE universities SET code = 'SAU1' WHERE id = 'eb2fc53c-04b0-43c0-b6af-7ece298ccecb'; -- Sichuan Agricultural University
UPDATE universities SET code = 'WU1' WHERE id = 'f78c7cdb-ae72-4264-98e1-9394f730af69'; -- Wuxi University
UPDATE universities SET code = 'XJU' WHERE id = '37d5b6b3-9078-4511-9b27-a9533148e58f'; -- Xi''an Jiaotong University
UPDATE universities SET code = 'XNU' WHERE id = 'd6a23e5e-e8a8-44e6-a775-a170d180d21b'; -- Xinyang Normal University
UPDATE universities SET code = 'YU1' WHERE id = 'e747424a-59f0-4be5-be2e-7fe4ff159e86'; -- Yantai University
UPDATE universities SET code = 'YU2' WHERE id = 'e1380a63-1789-4849-8a99-4d9ea69bbd91'; -- Yunnan University
UPDATE universities SET code = 'ZULI' WHERE id = '2183b649-8d05-4136-afb5-8540f1425cf8'; -- Zhengzhou University of Light Industry
UPDATE universities SET code = 'UCAS' WHERE id = '5d95932a-e611-41f8-a242-441927bf1126'; -- University of Chinese Academy of Sciences (UCAS)
UPDATE universities SET code = 'USTC' WHERE id = 'd645115d-8f0a-4654-bf23-da5b9b720950'; -- University of Science and Technology of China
UPDATE universities SET code = 'WPU' WHERE id = '61eeb8f0-2d57-4771-8302-15aee8294d68'; -- Wuhan Polytechnic University
UPDATE universities SET code = 'XU2' WHERE id = 'eb9f9e08-7871-4e35-baa3-ecaece50f408'; -- Xiamen University
UPDATE universities SET code = 'XUT' WHERE id = '070ea54d-e192-4b60-8e36-9d59bd0eb118'; -- Xuzhou University of Technology
UPDATE universities SET code = 'YU3' WHERE id = '5f44b915-d37f-489d-8be4-0a4f7a3af8c8'; -- Yibin University
UPDATE universities SET code = 'YICC' WHERE id = '312535ae-9c3a-45d6-a4e8-2ef44f20c66d'; -- Yiwu Industrial and Commercial College
UPDATE universities SET code = 'ZCMU' WHERE id = '136df054-0e8b-401c-b1e9-a2d77cf7bfdb'; -- Zhejiang Chinese Medical University
UPDATE universities SET code = 'BUAS' WHERE id = '4dd88f10-67a0-4072-9a50-02cc25e35038'; -- Baoji University of Arts and Sciences
UPDATE universities SET code = 'WUT' WHERE id = 'b21b08d8-a75c-44e5-b5ad-908a8f6a2bb2'; -- Wuchang University of Technology
UPDATE universities SET code = 'XMU1' WHERE id = '7fdb3a41-3915-4470-8c96-47e738deb26b'; -- Xuzhou Medical University
UPDATE universities SET code = 'XRVTI' WHERE id = '482080b1-83f8-4d89-af36-6bcf1f7e8151'; -- Xi''an Railway Vocational & Technical Institute
UPDATE universities SET code = 'YVC' WHERE id = '9d58f19b-97f5-4530-9e1c-04ea12b5066d'; -- Yantai Vocational College
UPDATE universities SET code = 'ZOU' WHERE id = '306ea71c-26a2-45ee-a352-57afb133c345'; -- Zhejiang Ocean University
UPDATE universities SET code = 'BHI' WHERE id = 'b4309ead-e7ae-48b5-9442-e1c4cb5061ca'; -- Beijing Hospitality Institute
UPDATE universities SET code = 'BHMS' WHERE id = '08968cac-c9e5-4584-8e0c-b168cfe91b85'; -- Beijing Huiwen Middle School
UPDATE universities SET code = 'CUEB' WHERE id = 'bd5ea298-c1ca-4062-95a6-4772d0747d6c'; -- Capital University of Economics and Business
UPDATE universities SET code = 'CU2' WHERE id = '020be525-6793-4036-99e1-e59784af2305'; -- Chengdu University
UPDATE universities SET code = 'CKGSB' WHERE id = 'd4670682-e556-42ec-8419-154cdf75d1f0'; -- Cheung Kong Graduate School of Business
UPDATE universities SET code = 'JMU' WHERE id = '02128ec1-7b81-40d6-ac66-8333a70ba0ed'; -- Jinzhou Medical University
UPDATE universities SET code = 'BUPT' WHERE id = '63107d18-242d-46be-aaf7-31350cf0a25a'; -- Beijing University of Posts and Telecommunication
UPDATE universities SET code = 'CUPBK' WHERE id = '1b34fbce-e3df-4fb6-851f-90fe104b3bab'; -- China University of Petroleum-Beijing at Karamay
UPDATE universities SET code = 'DKU' WHERE id = '539f1693-0f69-4bf7-92e1-6c75071d6cad'; -- Duke Kunshan University
UPDATE universities SET code = 'BIGC' WHERE id = '2f89c6e1-3bc9-470e-af51-623d7273ea52'; -- Beijing Institute of Graphic Communication
UPDATE universities SET code = 'CUPSL' WHERE id = '773f12ff-9ccc-4922-9ec7-ed3137d288e7'; -- China University of Political Science and Law
UPDATE universities SET code = 'CWU' WHERE id = '8e49b7dc-da2e-414e-938e-56c113748840'; -- China Women''s University
UPDATE universities SET code = 'CULCCSJTU' WHERE id = '49559c65-e193-4cc0-a041-895599784d94'; -- China-UK Low Carbon College, Shanghai Jiao Tong University
UPDATE universities SET code = 'CAUC' WHERE id = '3e521562-b3c8-4008-9ab1-7d55e85d9b52'; -- Civil Aviation University of China
UPDATE universities SET code = 'BIPT' WHERE id = 'a7e19a15-c299-474f-941a-efbfeec3487f'; -- Beijing Institute of Petrochemical Technology
UPDATE universities SET code = 'ECUPSL' WHERE id = 'a08c5e93-a4ed-4f1c-82e7-89c48abba286'; -- East China University of Political Science and Law
UPDATE universities SET code = 'FUIST' WHERE id = 'e10cf439-eabe-430b-a9f4-821e9e4d87ee'; -- Fuzhou University of International Studies and Trade
UPDATE universities SET code = 'JNU' WHERE id = 'f0221eaf-0454-46e4-942a-f2d11c3461b9'; -- Jilin Normal University
UPDATE universities SET code = 'JU1' WHERE id = '2ddbad7c-f480-47c1-a72b-c8b38c9b02a5'; -- Jilin University
UPDATE universities SET code = 'BIT' WHERE id = '40c33bf3-f966-4bb6-a985-c39b7dcf1b8b'; -- Beijing Institute of Technology
UPDATE universities SET code = 'HUST4' WHERE id = 'a7628ce6-6f55-48fc-94f4-c758b5905ed7'; -- Hebei University of Science and Technology
UPDATE universities SET code = 'DU1' WHERE id = 'd1a620bc-2e38-4a2e-a67c-bc26e6e5a6bd'; -- Dezhou University
UPDATE universities SET code = 'GMU1' WHERE id = '0404e3df-60c9-41c1-bde7-75c54b6c4257'; -- Guangzhou Medical University
UPDATE universities SET code = 'JU2' WHERE id = 'e73dbcdc-f59d-48fb-8a9a-20b520ae5fcf'; -- Jinggangshan University
UPDATE universities SET code = 'BITZ' WHERE id = 'ba57ceb5-48c5-4078-8f18-6f8d9c0381a4'; -- Beijing Institute of Technology, Zhuhai
UPDATE universities SET code = 'HUCM' WHERE id = '2a2c111d-c215-4743-bd81-64e4b86b1bee'; -- Henan University of Chinese Medicine
UPDATE universities SET code = 'HUST5' WHERE id = '951ac24e-acf2-4980-898c-3301b4ba6102'; -- Huazhong University  of Science and Technology
UPDATE universities SET code = 'LNU2' WHERE id = 'c98db5f6-e9ac-43c3-ba4d-4b6bb0832a63'; -- Leshan Normal University
UPDATE universities SET code = 'SU8' WHERE id = '4b11ec2a-b44e-497f-889d-3e51392a1858'; -- Soochow University
UPDATE universities SET code = 'SJU2' WHERE id = '9235daa9-df38-480b-b421-68c7b43ff21d'; -- Southwest Jiaotong University
UPDATE universities SET code = 'BICC' WHERE id = '215d2b79-aa8e-497a-afd0-80722b81c12b'; -- Beijing International Chinese College
UPDATE universities SET code = 'SSMU' WHERE id = '589c3644-1684-472c-87a1-c7fdd5dea665'; -- Shandong Second Medical University
UPDATE universities SET code = 'SAIF' WHERE id = '8acd3a25-58d0-430e-abc2-7f3d50e9eaf2'; -- Shanghai Advanced Institute of Finance
UPDATE universities SET code = 'SBCUSST' WHERE id = '4d1d18c8-289d-4608-bfde-9e013297241b'; -- The Sino-British College, University of Shanghai for Science and Technology
UPDATE universities SET code = 'BLCU' WHERE id = 'b20e3fcc-b163-4a87-b053-332f5d1118eb'; -- Beijing Language and Culture University
UPDATE universities SET code = 'BWU' WHERE id = '25770593-0135-46ef-b675-91b8f0cb5d9c'; -- Beijing Wuzi University
UPDATE universities SET code = 'CCT' WHERE id = '494e6ac0-82e7-463e-bf4a-23ebb8186870'; -- Career China & TAL
UPDATE universities SET code = 'CU3' WHERE id = 'd4e9e906-f510-41da-b5a5-39071a874ba5'; -- Chang’an University
UPDATE universities SET code = 'BNUHKBUUIC' WHERE id = '4c68935f-d06f-4fbc-aa36-a7011fb39241'; -- Beijing Normal University-Hong Kong Baptist University United International College
UPDATE universities SET code = 'SU9' WHERE id = 'bcb16965-bc5e-4537-9d0d-ae9b3537152d'; -- Shenyang University
UPDATE universities SET code = 'SU10' WHERE id = '4f634125-4c97-4743-9e2d-5acf123de9bf'; -- Shenyang University
UPDATE universities SET code = 'SBCUSST1' WHERE id = '5a4a120e-c617-40e8-9425-379891781b44'; -- Sino-British College, University of Shanghai for Science and Technology
UPDATE universities SET code = 'SBCUSST2' WHERE id = '18ded57d-dbbd-4d1d-a19d-6d0dc136d6de'; -- Sino-British College, University of Shanghai for Science and Technology
UPDATE universities SET code = 'SYSU' WHERE id = '455613d0-687c-4bdc-ab3b-2be3a00b15bf'; -- Sun Yat-sen University
UPDATE universities SET code = 'SYSU1' WHERE id = 'd8de3687-9a9b-4334-bea0-6e2a3639f6e9'; -- Sun Yat-sen University
UPDATE universities SET code = 'NU4' WHERE id = 'c0890153-39cb-4a49-9142-c983872aeb85'; -- Northeastern University
UPDATE universities SET code = 'TNU' WHERE id = 'a3fa778d-c5df-4afb-825e-c50dbeee3282'; -- Tianjin Normal University
UPDATE universities SET code = 'TU3' WHERE id = '40f01e12-66f8-4429-bdb0-a4908162ec9b'; -- Tsinghua University
UPDATE universities SET code = 'USTB' WHERE id = '831a2103-bdee-4785-be22-d435efb93abb'; -- University of Science and Technology Beijing
UPDATE universities SET code = 'USTB1' WHERE id = '21b24c21-3ae4-49e5-b757-285ece83c5a0'; -- University of Science and Technology Beijing
UPDATE universities SET code = 'WSU' WHERE id = 'fa74e04f-9b6f-4a80-9b73-3740fd2dfa31'; -- Wuhan Sports University
UPDATE universities SET code = 'WSU1' WHERE id = '3a90f90b-d15c-416b-905a-d257298b1c79'; -- Wuhan Sports University
UPDATE universities SET code = 'WUT1' WHERE id = 'b5cf8e4c-0fcf-4541-b32b-acc010414d80'; -- Wuhan University of Technology
UPDATE universities SET code = 'CUPT' WHERE id = 'c6eb8a93-f0dd-49ca-80c9-23a82264c222'; -- Chongqing University of Posts and Telecommunications
UPDATE universities SET code = 'XSU' WHERE id = 'adb4614f-daec-4eec-baa6-0759878609e4'; -- Xi''an Shiyou University
UPDATE universities SET code = 'XSU1' WHERE id = 'a1948afa-e029-4dde-89fa-6268e5361e3c'; -- Xi''an Shiyou University
UPDATE universities SET code = 'XNU1' WHERE id = 'c5719d63-e17b-46a9-ac4e-5ab91978e18f'; -- Xinjiang Normal University
UPDATE universities SET code = 'XNU2' WHERE id = '5ad5b864-a15e-48c7-88e7-d6f282baeb08'; -- Xinjiang Normal University
UPDATE universities SET code = 'YUFE1' WHERE id = 'df729ab1-bf7b-4ac9-9dd9-b8b57288a87f'; -- Yunnan University of Finance and Economics
UPDATE universities SET code = 'YNU2' WHERE id = '875b55cd-f26c-4ec2-9deb-69a939c44e60'; -- Yuxi Normal University
UPDATE universities SET code = 'BU2' WHERE id = 'd2fc6823-c1b4-4cea-8d22-ad090a685464'; -- Beihua University
UPDATE universities SET code = 'BCLCC' WHERE id = '4fb4c69a-c173-41b2-85e7-cc9a60837a88'; -- Beijing Chinese Language and Culture College
UPDATE universities SET code = 'BU3' WHERE id = '432ee13e-4767-4249-8262-f74cf0c5894f'; -- Binzhou University
UPDATE universities SET code = 'CNU' WHERE id = '03fa6e7a-92b8-44cf-b94c-5feaee6edcbe'; -- Capital Normal University
UPDATE universities SET code = 'CCNU' WHERE id = 'aef89146-34ea-449b-8012-c5c2cb1e734c'; -- Central China Normal University
UPDATE universities SET code = 'CJU' WHERE id = 'b72f6804-8a9a-432d-8156-2f86ad1e7e0c'; -- Chongqing Jiaotong University
UPDATE universities SET code = 'CMU1' WHERE id = '548dee90-5638-4a38-b450-4a301157fbc5'; -- Chongqing Medical University
UPDATE universities SET code = 'BTBU' WHERE id = 'a414539e-e40d-4d0a-9d4d-4a70b9757d6e'; -- Beijing Technology and Business University
UPDATE universities SET code = 'GU1' WHERE id = '2b771cf1-a58a-40a0-9ce4-77b1f9dcc85e'; -- Guizhou University
UPDATE universities SET code = 'LU1' WHERE id = '1d52d99e-eee1-4350-bd5f-a4df8d5696a0'; -- Liaoning University
UPDATE universities SET code = 'MNU' WHERE id = 'c79e13ad-bdda-4b1a-8e32-bb04dbd30189'; -- Mudanjiang Normal University
UPDATE universities SET code = 'NU5' WHERE id = 'ddafc223-3e5e-46fb-b4fd-433e1cbd81e5'; -- Nantong University
UPDATE universities SET code = 'BUPT1' WHERE id = 'd913abfb-128e-47dd-9ffb-de5a93636fe9'; -- Beijing University of Posts and Telecommunications
UPDATE universities SET code = 'GMU2' WHERE id = 'beadbaee-471f-4f88-ad66-a1c43d934851'; -- Guangxi Medical University
UPDATE universities SET code = 'HNU1' WHERE id = '5e96b5ca-8d11-4c53-a876-19c63155751e'; -- Hubei Normal University
UPDATE universities SET code = 'JMU1' WHERE id = 'fd6abf24-9c3a-4d88-a75d-19236f47d336'; -- Jinzhou Medical University
UPDATE universities SET code = 'LU2' WHERE id = '399c5a1c-7567-4981-8b47-cb81eb259231'; -- Ludong University
UPDATE universities SET code = 'NXU' WHERE id = '9d963369-8f51-4098-a73d-832550a70fde'; -- Nanjing Xiaozhuang University
UPDATE universities SET code = 'NU6' WHERE id = '6636fe3a-21a5-405e-beff-ece9e9546068'; -- Nantong University
UPDATE universities SET code = 'CUPES' WHERE id = '90982659-a92c-47b2-a97a-92a5cdadc030'; -- Capital University of Physical Education and Sports
UPDATE universities SET code = 'HU5' WHERE id = '9d478d1d-7d8b-4af1-9368-17e3a99c3e16'; -- Honghe University
UPDATE universities SET code = 'LU3' WHERE id = '457dc213-4d5d-480c-bfab-34caa95b0ea4'; -- Liaoning University
UPDATE universities SET code = 'NUCM' WHERE id = 'c014347b-7a6a-4ebd-b689-d89d2401e30b'; -- Nanjing University of Chinese Medicine
UPDATE universities SET code = 'NAU1' WHERE id = '59820f8a-e9bd-4d14-97e3-1c981a7672ac'; -- Northwest A&F University
UPDATE universities SET code = 'PU1' WHERE id = 'a5f3c25d-1b55-45ab-9008-94765118054a'; -- Peking University
UPDATE universities SET code = 'CSU' WHERE id = '97ac1530-37af-44a9-994f-68635be88b4b'; -- Central South University
UPDATE universities SET code = 'TFSU' WHERE id = '6520b84f-a777-48dd-be02-fd8f7a8c8b60'; -- Tianjin Foreign Studies University
UPDATE universities SET code = 'CUP' WHERE id = '26cad414-b5e0-4f21-ad58-9e40f5a526cb'; -- China University of Petroleum (East China)
UPDATE universities SET code = 'CYUPS' WHERE id = '71c4ca2e-1fa1-4234-9a4d-c1a72144b023'; -- China Youth University of Political Studies
UPDATE universities SET code = 'CU4' WHERE id = '2c88b1b8-2c21-4325-90f1-b051a088bb22'; -- Chongqing University
UPDATE universities SET code = 'DU2' WHERE id = '515463da-0ea9-4c10-b218-c9180928cd82'; -- Dali University
UPDATE universities SET code = 'WUT2' WHERE id = '32101546-8fea-4178-b593-419331731014'; -- Wuhan University of Technology
UPDATE universities SET code = 'YNU3' WHERE id = '1263ba1f-70c0-4e19-beca-675b5c3cae57'; -- Yuxi Normal University
UPDATE universities SET code = 'CMU2' WHERE id = 'baaec518-2a5b-4ce9-9d80-348daa9beead'; -- Capital Medical University
UPDATE universities SET code = 'CIT' WHERE id = '73a72a8c-53c6-40b7-bf55-ad6129368c8e'; -- Changzhou Institute of Technology
UPDATE universities SET code = 'CNU1' WHERE id = '8a50d870-e9ec-4427-af9b-4356b34629d4'; -- Chongqing Normal University
UPDATE universities SET code = 'SNU1' WHERE id = 'faa750c8-da41-4823-a1ab-3da6e2d7f78c'; -- Shenyang Normal University
UPDATE universities SET code = 'TFSU1' WHERE id = '06bdab37-3dd8-49fe-bd97-0228f7d6e563'; -- Tianjin Foreign Studies University
UPDATE universities SET code = 'TU4' WHERE id = 'd1919707-504b-403b-8a20-8764d2354798'; -- Tsinghua University
UPDATE universities SET code = 'CUST' WHERE id = '8c21daa4-5f5f-4f4f-9e6e-b0807f5c1eaf'; -- Changchun University of Science and Technology
UPDATE universities SET code = 'CUT' WHERE id = '8a403d05-2581-4bb4-8755-d911650d0d8f'; -- Changchun University of Technology
UPDATE universities SET code = 'CAP' WHERE id = 'c8472a9d-7a69-43e2-8b89-a3757c1ab2f8'; -- Chengdu Aeronautic Polytechnic
UPDATE universities SET code = 'CTBU' WHERE id = 'a7263f35-7ad7-4e40-9175-ba7717506beb'; -- Chongqing Technology and Business University
UPDATE universities SET code = 'FNU' WHERE id = 'c6bc0a94-9076-4897-af4c-4f4c89aed467'; -- Fujian Normal University
UPDATE universities SET code = 'GLIT' WHERE id = '9cd6b3b1-48b3-4bb4-99d7-e332de3f5484'; -- Guangdong Lingnan Institute of Technology
UPDATE universities SET code = 'UCAS1' WHERE id = 'fe0bd5fa-b399-4770-a060-f8f4a03c2ea6'; -- University of Chinese Academy of Sciences
UPDATE universities SET code = 'CU5' WHERE id = 'bc5ccf25-7e34-45e2-b83f-07e66e2664e9'; -- Changzhou University
UPDATE universities SET code = 'CUMT' WHERE id = '29c5b746-dc72-46a0-a0a7-9cab854082f2'; -- China University of Mining and Technology
UPDATE universities SET code = 'DJU' WHERE id = '282a69b1-c316-4a31-a374-3d6e77a2eaaa'; -- Dalian Jiaotong University
UPDATE universities SET code = 'GU2' WHERE id = 'f04c366e-e520-4e58-9aa8-851fbb19a302'; -- Guangxi University
UPDATE universities SET code = 'HU6' WHERE id = '7a8c90b9-b91d-4a61-b26b-84d2a8766f7f'; -- Honghe University
UPDATE universities SET code = 'TNU1' WHERE id = 'bd8a5578-48f1-4695-b520-016ec3b7d10d'; -- Tianjin Normal University
UPDATE universities SET code = 'GMU3' WHERE id = '5daf53b4-49b9-4131-94a4-8e8cb585acca'; -- Guangxi Medical University
UPDATE universities SET code = 'GU3' WHERE id = 'ec7c2a1b-573e-4f49-be4c-87b60aebc9a0'; -- Guizhou University
UPDATE universities SET code = 'HUEL' WHERE id = '5761f55a-76c3-45a5-88f6-d8093ce7d98e'; -- Henan University of Economics and Law
UPDATE universities SET code = 'HNU2' WHERE id = '015b7bea-c1cc-4a09-9101-ddd032f32ac6'; -- Hubei Normal University
UPDATE universities SET code = 'MNU1' WHERE id = 'e8abbce1-dec2-47cf-b402-7048d6b03c88'; -- Mudanjiang Normal University
UPDATE universities SET code = 'NU7' WHERE id = '8138646d-88fa-4fa9-95b2-a1bbdf28b4b0'; -- Nankai University
UPDATE universities SET code = 'NU8' WHERE id = '4c2c3bf7-2e65-474c-8584-62e432e1cf49'; -- Nankai University
UPDATE universities SET code = 'CPU' WHERE id = 'efbce7b1-9bb1-42a0-89cf-3b22d500c0f3'; -- China Pharmaceutical University
UPDATE universities SET code = 'CTBU1' WHERE id = '2e4b6c5f-a4c6-4d14-b1d3-a5832cb486e2'; -- Chongqing Technology and Business University
UPDATE universities SET code = 'DUT1' WHERE id = '4237b8ea-74bd-4bdb-a48e-27b31db3762e'; -- Dalian University of Technology
UPDATE universities SET code = 'DUFE' WHERE id = '8c23ee06-de34-4500-8310-abb0e90029cc'; -- Dongbei University of Finance and Economics
UPDATE universities SET code = 'ECJU' WHERE id = 'a321c06f-1247-41eb-bc8a-87cdc5f2ff14'; -- East China Jiaotong University
UPDATE universities SET code = 'ECNU' WHERE id = 'b399832f-c799-4c9f-9aaf-cb2f9f354d72'; -- East China Normal University
UPDATE universities SET code = 'FNU1' WHERE id = '65885fa6-ae60-4101-aff7-6e6e7f8b9321'; -- Fujian Normal University
UPDATE universities SET code = 'GLIT1' WHERE id = 'a3676cbf-ba19-4ebf-a08e-b04742356e6d'; -- Guangdong Lingnan Institute of Technology
UPDATE universities SET code = 'GUFS' WHERE id = 'd725d319-bcea-4d02-a9dc-4ef1812eb0b2'; -- Guangdong University of Foreign Studies
UPDATE universities SET code = 'GUT' WHERE id = '07d60f2a-845f-41ca-aa89-17e185604a37'; -- Guangdong University of Technology
UPDATE universities SET code = 'GIBVC' WHERE id = '702dbdea-4ccf-4f79-8577-ba6713b5a71b'; -- Guangxi International Business Vocational College
UPDATE universities SET code = 'GCC1' WHERE id = '63703cec-72e4-432d-b736-29314258016a'; -- Guangzhou College of Commerce
UPDATE universities SET code = 'HMU1' WHERE id = '91f00943-2aea-4347-ac56-0858d9e3e9b6'; -- Hainan Medical University
UPDATE universities SET code = 'HTOU' WHERE id = '72523560-fa6c-45ca-9900-34458f5e9d6a'; -- Hainan Tropical Ocean University
UPDATE universities SET code = 'HU7' WHERE id = '91347a15-138e-4e4b-9c93-3f2ada09b8ae'; -- Hainan University
UPDATE universities SET code = 'HU8' WHERE id = '00ee120a-9f8e-4509-b0d0-1e52a1300ab9'; -- Huaihua University
UPDATE universities SET code = 'JU3' WHERE id = 'cad4f400-591c-499b-9c37-3c566a4a6298'; -- Jiamusi University
UPDATE universities SET code = 'JCN' WHERE id = 'fa32d25f-fceb-4859-8326-ad50d95a94f9'; -- Jiangsu College of Nursing
UPDATE universities SET code = 'JCT' WHERE id = '08cf4cdb-719b-4248-aa3b-374d1475aeb0'; -- Jiangsu College of Tourism
UPDATE universities SET code = 'HNU3' WHERE id = '15fc2cb8-7ac7-4428-a71d-b422f5b90e98'; -- Hangzhou Normal University
UPDATE universities SET code = 'HUEL1' WHERE id = 'febbf16d-2309-4a5c-a8c1-6cd76ff55bae'; -- Henan University of Economics and Law
UPDATE universities SET code = 'HUT1' WHERE id = 'e33c395a-58d4-439b-af23-4d79b27507e1'; -- Hunan University of Technology
UPDATE universities SET code = 'JU4' WHERE id = 'b98f350f-2207-4451-990b-036ed9b53fcd'; -- Jiamusi University
UPDATE universities SET code = 'JOU' WHERE id = 'fb50ea08-12e1-4b4c-a53d-18923e084b17'; -- Jiangsu Ocean University
UPDATE universities SET code = 'JU5' WHERE id = '625ebc9e-73fd-487f-9146-a3137986e903'; -- Jiaxing University
UPDATE universities SET code = 'HUT2' WHERE id = 'f8be9b89-c2f8-4ccf-9b15-804529aa99e8'; -- Hefei University of Technology 
UPDATE universities SET code = 'HPU' WHERE id = '8f29f156-292e-4e8b-bb91-eef43cf8c435'; -- Henan Polytechnic University
UPDATE universities SET code = 'HU9' WHERE id = '40e559d1-39df-4f4e-9f6c-f58106defe4e'; -- Hubei University
UPDATE universities SET code = 'HNU4' WHERE id = '70e24572-06bf-4f83-9ed3-03e4dbfb2dd1'; -- Hunan Normal University
UPDATE universities SET code = 'JU6' WHERE id = '4cab6b94-1fa5-4046-8cf3-ca3d7a14a067'; -- Jiangsu University
UPDATE universities SET code = 'JNU1' WHERE id = '28d68716-2e33-449a-998a-6416732a984f'; -- Jiangxi Normal University
UPDATE universities SET code = 'JUFE' WHERE id = 'fa87a0f4-7a88-40c9-a591-51529d0a3bcb'; -- Jiangxi University of Finance and Economics
UPDATE universities SET code = 'NUT' WHERE id = '9e6d82c0-146f-4533-80e4-c2f0075a3e8e'; -- Ningbo University Of Technology
UPDATE universities SET code = 'LNU3' WHERE id = 'ede56dbf-0511-4681-b919-70571c9e6a43'; -- Langfang Normal University
UPDATE universities SET code = 'LU4' WHERE id = '6f00d351-25ab-40d3-9991-752461aa5558'; -- Linyi University
UPDATE universities SET code = 'MTC' WHERE id = '67e5d34b-3720-4b18-aaf8-9724b809e0cb'; -- Mianyang Teachers College
UPDATE universities SET code = 'NHU' WHERE id = 'a85b516a-4304-4a18-9e73-a40b1e4d4863'; -- Nanchang Hangkong University
UPDATE universities SET code = 'NUIST' WHERE id = 'b23d9e1f-b91c-4774-9a85-f9624af7e2a7'; -- Nanjing University of Information Science & Technology
UPDATE universities SET code = 'LPU' WHERE id = 'f156eea1-565d-4c17-bf0c-ff351755a35c'; -- Liaoning Petrochemical University
UPDATE universities SET code = 'LU5' WHERE id = 'd4de50b6-a224-4fb8-ae93-23df86649222'; -- Ludong University
UPDATE universities SET code = 'NVTC' WHERE id = '76b6104b-bea8-4223-b7b7-7a52fa0a43a4'; -- Nanchong Vocational and Technical College
UPDATE universities SET code = 'NMU1' WHERE id = 'ae571cc1-c003-46a0-b2e8-858244489964'; -- Nanjing Medical University
UPDATE universities SET code = 'NUAA' WHERE id = '1677810a-c6d9-4a45-a72f-96513672e0f5'; -- Nanjing University of Aeronautics and Astronautics
UPDATE universities SET code = 'NU9' WHERE id = '9366ac91-93e3-423c-9baf-e8d5e13757fe'; -- Ningbo University
UPDATE universities SET code = 'LTU' WHERE id = 'a576fc06-c20b-4520-80f6-f21fa8dd291e'; -- Liaoning Technical University
UPDATE universities SET code = 'LMS' WHERE id = '98a2f91b-e1a9-4c14-bfcc-9fd4b9297c11'; -- LTL Mandarin School
UPDATE universities SET code = 'LVTC1' WHERE id = 'a2357404-8ee7-4568-bd00-7280e05f8c84'; -- Luzhou Vocational and Technical College
UPDATE universities SET code = 'NIT' WHERE id = 'f018d3f3-a5e9-44ed-8339-214d69326731'; -- Nanjing Institute of Technology
UPDATE universities SET code = 'NUPT' WHERE id = 'c01449cf-871d-477f-a224-852eb5992fd3'; -- Nanjing University of Posts and Telecommunications
UPDATE universities SET code = 'NAU2' WHERE id = '2624bd1b-39a2-44a1-aaf4-503547ff7d05'; -- Northwest A&F University
UPDATE universities SET code = 'SNU2' WHERE id = '190980b8-b36d-413f-8dab-60ab10a4163c'; -- Shaanxi Normal University
UPDATE universities SET code = 'SNU3' WHERE id = '7d618773-655f-49be-8ec8-ab6ecf375e90'; -- Shandong Normal University
UPDATE universities SET code = 'SJTU' WHERE id = 'e12f24be-b19d-4435-a31f-bb6f22868117'; -- Shanghai Jiao Tong University
UPDATE universities SET code = 'SUES' WHERE id = '5f66ef78-f4bb-4981-93f5-e8b7eb33d5db'; -- Shanghai University of Engineering Science
UPDATE universities SET code = 'SNU4' WHERE id = '12250538-7ea0-4920-9efe-9f9dfd76fc44'; -- Shenyang Normal University
UPDATE universities SET code = 'SSMU1' WHERE id = '71517138-59ca-483f-bb09-15fd173d5fb8'; -- Shandong Second Medical University
UPDATE universities SET code = 'SUFE2' WHERE id = '703a8326-41d0-442e-9632-de23e5482bad'; -- Shandong University of Finance and Economics
UPDATE universities SET code = 'SUST2' WHERE id = '208b23ae-7d5f-4296-aa4f-a6635935bdc1'; -- Shandong University of Science and Technology
UPDATE universities SET code = 'SPPC' WHERE id = '73138fc7-f190-473f-ac6b-15d16c577b3a'; -- Shanghai Publishing and Printing College
UPDATE universities SET code = 'SBCUSST3' WHERE id = '3d1034dd-cadd-4947-8aed-095b77d507af'; -- The Sino-British College, University of Shanghai for Science and Technology
UPDATE universities SET code = 'SUFE3' WHERE id = 'b2ef5ffa-2759-408c-aaf8-ac3d251e149f'; -- Shandong University of Finance and Economics
UPDATE universities SET code = 'SAIF1' WHERE id = '72151a1b-f813-46b4-8ecd-fd0fd0f279ab'; -- Shanghai Advanced Institute of Finance
UPDATE universities SET code = 'SMU3' WHERE id = '8f54d07b-b4ce-4d6d-b587-f987b8607e0d'; -- Shanghai Maritime University
UPDATE universities SET code = 'SUST3' WHERE id = 'b233160a-2c20-4ca4-880a-5fbbb59cbd1a'; -- Southern University of Science and Technology
UPDATE universities SET code = 'SPSU1' WHERE id = 'ad4cb497-8740-41dd-b6a7-982e8966383c'; -- St Petersburg State University(Russia)
UPDATE universities SET code = 'UESTC' WHERE id = '03966e70-c01b-4cfc-96c9-0c94a2f53c58'; -- University of Electronic Science and Technology of China
UPDATE universities SET code = 'UJ' WHERE id = 'e4778f68-81f2-4ad2-9761-e5c5c1404f88'; -- University of Jinan
