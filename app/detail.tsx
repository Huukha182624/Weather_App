import { View, Text, FlatList, StyleSheet, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const API = process.env.EXPO_PUBLIC_WEATHER_API_URL!;
const KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY!;

export default function Detail() {
    const { city } = useLocalSearchParams();
    const router = useRouter();

    const [current, setCurrent] = useState<any>(null);
    const [forecast, setForecast] = useState<any[]>([]);
    const [todayRain, setTodayRain] = useState<number>(0);

    useEffect(() => {
        if (city) fetchWeatherDetail();
    }, [city]);

    const fetchWeatherDetail = async () => {
        try {
            // ===== CURRENT WEATHER =====
            const currentRes = await fetch(
                `${API}/weather?q=${city}&appid=${KEY}&units=metric`
            );
            const currentData = await currentRes.json();

            if (currentData.cod === 200) {
                setCurrent(currentData);
            }

            // ===== FORECAST 5 DAYS =====
            const forecastRes = await fetch(
                `${API}/forecast?q=${city}&appid=${KEY}&units=metric`
            );
            const forecastData = await forecastRes.json();

            if (forecastData.cod === "200") {
                // Lọc 12h trưa mỗi ngày
                const daily = forecastData.list.filter((i: any) =>
                    i.dt_txt.includes("12:00:00")
                );
                setForecast(daily);

                // ===== TÍNH MƯA HÔM NAY =====
                const firstDate = forecastData.list[0].dt_txt.split(" ")[0];

                const todayList = forecastData.list.filter((item: any) =>
                    item.dt_txt.startsWith(firstDate)
                );

                const totalRain = todayList.reduce((sum: number, item: any) => {
                    return sum + (item.rain?.["3h"] || 0);
                }, 0);

                setTodayRain(totalRain);
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    const iconMap: any = {
        Clear: require("../assets/sun.webp"),
        Clouds: require("../assets/cloud.webp"),
        Rain: require("../assets/rain.png"),
        Snow: require("../assets/snow.png"),
        default: require("../assets/cloud.webp"),
    };

    const formatDayLabel = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    const formatFullDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
        });
    };

    const InfoCard = ({ title, value, extra, icon }: any) => (
        <View style={styles.iosCard}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <Image source={icon} style={styles.iosIcon} />
                <Text style={styles.iosTitle}>{title}</Text>
            </View>

            <Text style={styles.iosValue}>{value}</Text>

            {extra && <Text style={styles.iosExtra}>{extra}</Text>}
        </View>
    );

    return (
        <LinearGradient
            colors={["#bedbf5", "#503799"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 3 }}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.back}>← Back</Text>
                </Pressable>

                {current && (
                    <>
                        <View style={styles.headerRow}>
                            <View style={styles.leftBlock}>
                                <Text style={styles.city}>{current.name}</Text>

                                <Text style={styles.temp}>
                                    {Math.round(current.main.temp)}°
                                </Text>

                                <Text style={styles.desc}>
                                    {current.weather[0].description}
                                </Text>
                            </View>

                            <Image
                                source={
                                    iconMap[current.weather[0].main] ||
                                    iconMap.default
                                }
                                style={styles.mainIcon}
                            />
                        </View>

                        <View style={styles.grid}>
                            <InfoCard
                                title="Humidity"
                                value={`${current.main.humidity}%`}
                                extra="Air humidity level"
                                icon={require("../assets/humidity.webp")}
                            />

                            <InfoCard
                                title="Wind"
                                value={`${current.wind.speed} km/h`}
                                extra={`Gust ${current.wind.gust || 0} km/h`}
                                icon={require("../assets/wind.webp")}
                            />

                            <InfoCard
                                title="Pressure"
                                value={`${current.main.pressure} hPa`}
                                extra="Atmospheric pressure"
                                icon={require("../assets/pressure.png")}
                            />

                            <InfoCard
                                title="Rain"
                                value={`${todayRain.toFixed(1)} mm`}
                                extra="Total rainfall today"
                                icon={require("../assets/drop.png")}
                            />

                            <InfoCard
                                title="Feels Like"
                                value={`${Math.round(current.main.feels_like)}°`}
                                extra="Perceived temperature"
                                icon={require("../assets/thermo.webp")}
                            />

                            <InfoCard
                                title="Visibility"
                                value={`${(current.visibility / 1000).toFixed(1)} km`}
                                extra="Clear visibility"
                                icon={require("../assets/vision.webp")}
                            />
                        </View>
                    </>
                )}

                <Text style={styles.title}>5 Days Forecast</Text>


                <FlatList
                    data={forecast}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.dt.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                        <View style={styles.forecastCard}>
                            <View>
                                <Text style={styles.fullDate}>
                                    {formatFullDate(item.dt)}
                                </Text>
                            </View>
                            <Text style={styles.dayLabel}>
                                {formatDayLabel(item.dt)}
                            </Text>

                            <Image
                                source={
                                    iconMap[item.weather[0].main] ||
                                    iconMap.default
                                }
                                style={styles.smallIcon}
                            />

                            <Text style={styles.tempMax}>
                                {Math.round(item.main.temp)}°
                            </Text>
                        </View>
                    )}
                />
                </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 15, paddingTop: 40 },

    back: { marginLeft: 15, color: "#053161" },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    leftBlock: { flex: 1 },

    city: {
        fontSize: 30,
        fontWeight: "700",
        color: "#0b0334",
        marginLeft: 20,
    },

    mainIcon: {
        marginTop: -30,
        width: 150,
        height: 150,
        marginRight: 30,
    },

    temp: {
        fontSize: 50,
        fontWeight: "300",
        color: "#fff",
        marginLeft: 30,
    },

    desc: {
        color: "rgba(13,7,56,0.8)",
        fontSize: 14,
        marginLeft: 30,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginVertical: 15,
        marginTop: -10,
        alignItems: "center",

    },

    forecastCard: {
        width: 110,
        marginRight: 15,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    fullDate: { color: "#250565", fontSize: 12 },

    dayLabel: {
        color: "#000",
        fontSize: 20,
        fontWeight: "600",
    },

    tempMax: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },

    smallIcon: { width: 60, height: 60 },

    iosCard: {
        width: "48%",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
    },

    iosIcon: { width: 40, height: 30, marginRight: 6 },

    iosTitle: {
        fontSize: 20,
        color: "#e0f7ff",
        fontWeight: "600",
    },

    iosValue: {
        fontSize: 26,
        fontWeight: "700",
        color: "#fff",
        marginVertical: 6,
    },

    iosExtra: { fontSize: 13, color: "#d0f0ff" },
});