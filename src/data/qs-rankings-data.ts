export interface QSUniversity {
  rank: string;
  name: string;
  city: string;
  overallScore: number;
  slug?: string; // slug on our site — undefined means no page exists yet
}

export const qsRankings2026: QSUniversity[] = [
  { rank: "14", name: "Peking University", city: "Beijing", overallScore: 92.6, slug: "peking-university" },
  { rank: "=17", name: "Tsinghua University", city: "Beijing", overallScore: 91.2, slug: "tsinghua-university" },
  { rank: "30", name: "Fudan University", city: "Shanghai", overallScore: 88.4, slug: "fudan-university" },
  { rank: "=47", name: "Shanghai Jiao Tong University", city: "Shanghai", overallScore: 84.3, slug: "shanghai-jiao-tong-university" },
  { rank: "49", name: "Zhejiang University", city: "Hangzhou", overallScore: 84.0, slug: "zhejiang-university" },
  { rank: "=103", name: "Nanjing University", city: "Nanjing", overallScore: 67.7, slug: "nanjing-university" },
  { rank: "=132", name: "University of Science and Technology of China", city: "Hefei", overallScore: 64.2, slug: "university-of-science-and-technology-of-china" },
  { rank: "=177", name: "Tongji University", city: "Shanghai", overallScore: 58.8, slug: "tongji-university" },
  { rank: "186", name: "Wuhan University", city: "Wuhan", overallScore: 57.3, slug: "wuhan-university" },
  { rank: "=247", name: "Beijing Normal University", city: "Beijing", overallScore: 50.6, slug: "beijing-normal-university" },
  { rank: "256", name: "Harbin Institute of Technology", city: "Harbin", overallScore: 49.8, slug: "harbin-institute-of-technology" },
  { rank: "=257", name: "Tianjin University", city: "Tianjin", overallScore: 49.7, slug: "tianjin-university" },
  { rank: "=259", name: "Beijing Institute of Technology", city: "Beijing", overallScore: 49.5, slug: "beijing-institute-of-technology" },
  { rank: "=276", name: "Sun Yat-sen University", city: "Guangzhou", overallScore: 48.0, slug: "sun-yat-sen-university" },
  { rank: "305", name: "Xi'an Jiaotong University", city: "Xi'an", overallScore: 45.0, slug: "xian-jiaotong-university" },
  { rank: "319", name: "Huazhong University of Science and Technology", city: "Wuhan", overallScore: 43.8, slug: "huazhong-university-of-science-and-technology" },
  { rank: "=324", name: "Sichuan University", city: "Chengdu", overallScore: 43.0, slug: "sichuan-university" },
  { rank: "=339", name: "Shandong University", city: "Jinan", overallScore: 42.2, slug: "shandong-university" },
  { rank: "341", name: "Xiamen University", city: "Xiamen", overallScore: 42.1, slug: "xiamen-university" },
  { rank: "=343", name: "Southern University of Science and Technology (SUSTech)", city: "Shenzhen", overallScore: 41.8, slug: "southern-university-of-science-and-technology" },
  { rank: "344", name: "Beihang University", city: "Beijing", overallScore: 41.7, slug: "beihang-university" },
  { rank: "=351", name: "Southeast University", city: "Nanjing", overallScore: 41.3, slug: "southeast-university" },
  { rank: "=383", name: "Nankai University", city: "Tianjin", overallScore: 38.5, slug: "nankai-university" },
  { rank: "=385", name: "Hunan University", city: "Changsha", overallScore: 38.4, slug: "hunan-university" },
  { rank: "=392", name: "Dalian University of Technology", city: "Dalian", overallScore: 37.8, slug: "dalian-university-of-technology" },
  { rank: "=408", name: "South China University of Technology", city: "Guangzhou", overallScore: 36.7, slug: "south-china-university-of-technology" },
  { rank: "=427", name: "East China Normal University", city: "Shanghai", overallScore: 35.6, slug: "east-china-normal-university" },
  { rank: "=440", name: "Jilin University", city: "Changchun", overallScore: 34.7, slug: "jilin-university" },
  { rank: "=457", name: "Central South University", city: "Changsha", overallScore: 33.6, slug: "central-south-university" },
  { rank: "=459", name: "Northwestern Polytechnical University", city: "Xi'an", overallScore: 33.5, slug: "northwestern-polytechnical-university" },
  { rank: "=462", name: "University of Electronic Science and Technology of China", city: "Chengdu", overallScore: 33.3, slug: "university-of-electronic-science-and-technology-of-china" },
  { rank: "=476", name: "East China University of Science and Technology", city: "Shanghai", overallScore: 32.3, slug: "east-china-university-of-science-and-technology" },
  { rank: "=488", name: "Renmin University of China", city: "Beijing", overallScore: 31.6, slug: "renmin-university-of-china" },
  { rank: "=497", name: "Southwest University", city: "Chongqing", overallScore: 31.1, slug: "southwest-university" },
  { rank: "=511", name: "Nanjing University of Science and Technology", city: "Nanjing", overallScore: 30.1, slug: "nanjing-university-of-science-and-technology" },
  { rank: "=521", name: "China Agricultural University", city: "Beijing", overallScore: 29.5, slug: "china-agricultural-university" },
  { rank: "=545", name: "Wuhan University of Technology", city: "Wuhan", overallScore: 28.3, slug: "wuhan-university-of-technology" },
  { rank: "=569", name: "Beijing University of Chemical Technology", city: "Beijing", overallScore: 27.0, slug: "beijing-university-of-chemical-technology" },
  { rank: "=581", name: "Nanjing University of Aeronautics and Astronautics", city: "Nanjing", overallScore: 26.4, slug: "nanjing-university-of-aeronautics-and-astronautics" },
  { rank: "=601", name: "Ocean University of China", city: "Qingdao", overallScore: 25.3, slug: "ocean-university-of-china" },
  { rank: "=611", name: "Shanghai University", city: "Shanghai", overallScore: 24.7, slug: "shanghai-university" },
  { rank: "=621", name: "Beijing Jiaotong University", city: "Beijing", overallScore: 24.2, slug: "beijing-jiaotong-university" },
  { rank: "=631", name: "Chongqing University", city: "Chongqing", overallScore: 23.7, slug: "chongqing-university" },
  { rank: "=641", name: "China University of Geosciences", city: "Wuhan", overallScore: 23.2, slug: "china-university-of-geosciences" },
  { rank: "=661", name: "Nanjing Agricultural University", city: "Nanjing", overallScore: 22.1, slug: "nanjing-agricultural-university" },
  { rank: "=681", name: "Northeastern University (China)", city: "Shenyang", overallScore: 21.1, slug: "northeastern-university" },
  { rank: "=691", name: "Northwest A&F University", city: "Yangling", overallScore: 20.6, slug: "northwest-af-university" },
  { rank: "=701", name: "Shenzhen University", city: "Shenzhen", overallScore: 20.0, slug: "shenzhen-university" },
  { rank: "=731", name: "Zhengzhou University", city: "Zhengzhou", overallScore: 18.6, slug: "zhengzhou-university" },
  { rank: "=741", name: "Soochow University", city: "Suzhou", overallScore: 18.1, slug: "soochow-university" },
  { rank: "=751", name: "Beijing University of Technology", city: "Beijing", overallScore: 17.6, slug: "beijing-university-of-technology" },
  { rank: "=781", name: "Nanjing Normal University", city: "Nanjing", overallScore: 16.1, slug: "nanjing-normal-university" },
  { rank: "=791", name: "China University of Petroleum (East China)", city: "Qingdao", overallScore: 15.7, slug: "china-university-of-petroleum" },
  { rank: "=801", name: "Shanghai International Studies University", city: "Shanghai", overallScore: 15.2, slug: "shanghai-international-studies-university" },
  { rank: "=851", name: "Jiangnan University", city: "Wuxi", overallScore: 13.0, slug: "jiangnan-university" },
  { rank: "=871", name: "Hefei University of Technology", city: "Hefei", overallScore: 12.0, slug: "hefei-university-of-technology" },
  { rank: "=891", name: "Lanzhou University", city: "Lanzhou", overallScore: 11.1, slug: "lanzhou-university" },
  { rank: "=901", name: "Zhejiang Normal University", city: "Jinhua", overallScore: 10.6, slug: "zhejiang-normal-university" },
  { rank: "=951", name: "Fuzhou University", city: "Fuzhou", overallScore: 8.5, slug: "fuzhou-university" },
  { rank: "=961", name: "Shanghai Normal University", city: "Shanghai", overallScore: 8.0, slug: "shanghai-normal-university" },
  { rank: "=981", name: "Guangzhou University", city: "Guangzhou", overallScore: 7.1, slug: "guangzhou-university" },
  { rank: "=1001", name: "Changzhou University", city: "Changzhou", overallScore: 6.0, slug: "changzhou-university" },
  { rank: "=1041", name: "Nanjing University of Information Science and Technology", city: "Nanjing", overallScore: 4.5, slug: "nanjing-university-of-information-science-and-technology" },
  { rank: "=1061", name: "Qingdao University", city: "Qingdao", overallScore: 3.5, slug: "qingdao-university" },
  { rank: "=1101", name: "Wenzhou University", city: "Wenzhou", overallScore: 2.0, slug: "wenzhou-university" },
  { rank: "=1141", name: "Anhui University", city: "Hefei", overallScore: 1.0, slug: "anhui-university" },
  { rank: "=1161", name: "Jiangsu University", city: "Zhenjiang", overallScore: 0.5, slug: "jiangsu-university" },
  { rank: "=1201", name: "Kunming University of Science and Technology", city: "Kunming", overallScore: 0.0, slug: "kunming-university-of-science-and-technology" },
  { rank: "=1201", name: "Nantong University", city: "Nantong", overallScore: 0.0, slug: "nantong-university" },
  { rank: "=1201", name: "Shandong University of Science and Technology", city: "Qingdao", overallScore: 0.0, slug: "shandong-university-of-science-and-technology" },
  { rank: "=1401", name: "Xinjiang University", city: "Urumqi", overallScore: 0.0, slug: "xinjiang-university" },
  { rank: "=1401", name: "Yangzhou University", city: "Yangzhou", overallScore: 0.0, slug: "yangzhou-university" },
];

// Utility to get numeric rank for sorting
export function getNumericRank(rank: string): number {
  return parseInt(rank.replace("=", ""), 10);
}

// Get unique cities
export function getUniqueCities(): string[] {
  return [...new Set(qsRankings2026.map(u => u.city))].sort();
}

// Tier classification
export type RankingTier = "top50" | "top200" | "top500" | "remaining";

export function getTier(rank: string): RankingTier {
  const num = getNumericRank(rank);
  if (num <= 50) return "top50";
  if (num <= 200) return "top200";
  if (num <= 500) return "top500";
  return "remaining";
}

export const tierLabels: Record<RankingTier, string> = {
  top50: "Top 50 Globally",
  top200: "Top 51–200",
  top500: "Top 201–500",
  remaining: "501+",
};

export const tierColors: Record<RankingTier, string> = {
  top50: "from-amber-500 to-yellow-400",
  top200: "from-sky-500 to-blue-400",
  top500: "from-emerald-500 to-green-400",
  remaining: "from-slate-500 to-gray-400",
};
