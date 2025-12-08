import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ImageBackground, Dimensions, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useCities } from '../hooks/useData';
import Loader from '../components/Loader';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const GAP = 12;
const ITEM_WIDTH = (width - 32 - GAP) / 2;

// Bundled local images for cities
const LOCAL_IMAGES: Record<string, ImageSourcePropType> = {
    'Beijing': require('../assets/images/beijing.jpg'),
    'Harbin': require('../assets/images/harbin.jpg'),
    'Dalian': require('../assets/images/dalian.jpg'),
    'Linyi': require('../assets/images/linyi.jpg'),
    'Qingdao': require('../assets/images/qingdao.jpg'),
    'Jinan': require('../assets/images/jinan.jpg'),
    "Xi'an": require('../assets/images/xian.jpg'),
    'Nanjing': require('../assets/images/nanjing.jpg'),
    'Tianjin': require('../assets/images/tianjin.jpg'),
    'Zhuhai': require('../assets/images/zhuhai.jpg'),
    'Suzhou': require('../assets/images/suzhou.jpg'),
    'Dongying and Qingdao': require('../assets/images/dongying_qingdao.jpg'),
};

// Remote JPG photos for other cities
const REMOTE_IMAGES: Record<string, string> = {
    'Shanghai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Pudong_Shanghai_November_2017_panorama.jpg/1280px-Pudong_Shanghai_November_2017_panorama.jpg',
    'Wuhan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Wuhan_Skyline_2021.jpg/1280px-Wuhan_Skyline_2021.jpg',
    'Hangzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hangzhou_CBD_along_the_river_2022.jpg/1280px-Hangzhou_CBD_along_the_river_2022.jpg',
    'Chengdu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Chengdu_Skyline_2021.jpg/1280px-Chengdu_Skyline_2021.jpg',
    'Guangzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Guangzhou_dusk_11-5-2008.jpg/1280px-Guangzhou_dusk_11-5-2008.jpg',
    'Shenzhen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shenzhen_CBD_and_River.jpg/1280px-Shenzhen_CBD_and_River.jpg',
    'Tianjin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Tianjin_Skyline_2009_Sep_11_by_Nangua_2.jpg/1280px-Tianjin_Skyline_2009_Sep_11_by_Nangua_2.jpg',
    'Chongqing': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Chongqing_Night_Yuzhong.jpg/1280px-Chongqing_Night_Yuzhong.jpg',
    'Suzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Suzhou_Jinji_Lake.jpg/1280px-Suzhou_Jinji_Lake.jpg',
    'Xiamen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Xiamen_China_Skyline.jpg/1280px-Xiamen_China_Skyline.jpg',
    'Changsha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Changsha_skyline_2018.jpg/1280px-Changsha_skyline_2018.jpg',
    'Kunming': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kunming_Dianchi.jpg/1280px-Kunming_Dianchi.jpg',
    'Fuzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Fuzhou_Jiangbin.jpg/1280px-Fuzhou_Jiangbin.jpg',
    'Hefei': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hefei_Swan_Lake_CBD.jpg/1280px-Hefei_Swan_Lake_CBD.jpg',
    'Shenyang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Shenyang_Skyline_2019.jpg/1280px-Shenyang_Skyline_2019.jpg',
    'Zhengzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Zhengzhou_CBD_night.jpg/1280px-Zhengzhou_CBD_night.jpg',
    'Wuxi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wuxi_Skyline_2020.jpg/1280px-Wuxi_Skyline_2020.jpg',
    'Ningbo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ningbo_skyline_1.jpg/1280px-Ningbo_skyline_1.jpg',
    'Nanchang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Nanchang_Skyline_2020.jpg/1280px-Nanchang_Skyline_2020.jpg',
    'Lanzhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Lanzhou-rio-amarillo-china.jpg/1280px-Lanzhou-rio-amarillo-china.jpg',
    'Nanning': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Nanning_skyline_2.jpg/1280px-Nanning_skyline_2.jpg',
    'Zhuhai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Zhuhai_panorama.jpg/1280px-Zhuhai_panorama.jpg',
    'Dongying and Qingdao': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Qingdao_Olympic_Sailing_Center.jpg/1280px-Qingdao_Olympic_Sailing_Center.jpg',
    'Nanjing': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Nanjing_Skyline_2021.jpg/1280px-Nanjing_Skyline_2021.jpg',
    "Xi'an": 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Xi%27an_Skyline_2020.jpg/1280px-Xi%27an_Skyline_2020.jpg',
};

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Pudong_Shanghai_November_2017_panorama.jpg/1280px-Pudong_Shanghai_November_2017_panorama.jpg';

function getCityImage(cityName: string): ImageSourcePropType {
    const name = cityName.trim();
    // Check if we have a local bundled image
    if (LOCAL_IMAGES[name]) {
        return LOCAL_IMAGES[name];
    }
    // Otherwise use remote URL
    const url = REMOTE_IMAGES[name] || DEFAULT_IMAGE;
    return { uri: url };
}

export default function CitiesScreen() {
    const router = useRouter();
    const { cities, loading } = useCities();
    const { isRTL } = useLanguage();
    const { t } = useTranslation();

    const handleCityPress = (city: string) => {
        router.push({
            pathname: '/(tabs)/universities',
            params: { city: city }
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    return (
        <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
            <LinearGradient colors={['#991B1B', '#B91C1C']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#FFF" />
                        </Pressable>
                        <View>
                            <Text style={styles.headerTitle}>{t('cities.title')}</Text>
                            <Text style={styles.headerSubtitle}>{t('cities.subtitle')}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {cities.map((city, index) => (
                        <MotiView
                            key={city.name}
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: index * 50 }}
                            style={styles.cardContainer}
                        >
                            <Pressable
                                style={styles.card}
                                onPress={() => handleCityPress(city.name)}
                            >
                                <ImageBackground
                                    source={getCityImage(city.name)}
                                    style={styles.cardImage}
                                    imageStyle={{ borderRadius: 16 }}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.gradient}
                                    >
                                        <View style={styles.cardContent}>
                                            <Text style={styles.cityName}>{city.name}</Text>
                                            <View style={styles.badge}>
                                                <MapPin size={10} color="#FFF" />
                                                <Text style={styles.badgeText}>{city.count} {t('common.unis')}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </ImageBackground>
                            </Pressable>
                        </MotiView>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
    },
    cardContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.3,
        marginBottom: 4,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: '#FFF',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    gradient: {
        height: '60%',
        justifyContent: 'flex-end',
        padding: 12,
    },
    cardContent: {
        gap: 4,
    },
    cityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
});
