import { View, Text, FlatList, StyleSheet, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const API = process.env.EXPO_PUBLIC_WEATHER_API_URL!;
const KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY!;

export default function Detail() {
    const { city } = useLocalSearchParams();
    const router = useRouter();

    const [forecast, setForecast] = useState<any[]>([]);
    const [current, setCurrent] = useState<any>(null);

    useEffect(() => {
        load();
    });

    const load = async () => {
        const res = await fetch(
            `${API}/forecast?q=${city}&appid=${KEY}&units=metric`
        );
        const data = await res.json();

        setCurrent(data.list[0]);

        setForecast(
            data.list.filter((i: any) => i.dt_txt.includes("12:00:00"))
        );
    };

    const iconMap: any = {
        Clear: require("../assets/sun.png"),
        Clouds: require("../assets/cloud.png"),
        Rain: require("../assets/rain.png"),
        Snow: require("../assets/snow.png"),
    };

    const Info = ({ icon, label, value }: any) => (
        <View style={styles.infoCard}>
            <Image source={icon} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.back()}>
                <Text style={styles.back}>← Back</Text>
            </Pressable>

            <Text style={styles.city}>{city}</Text>

            {current && (
                <>
                    <Image
                        source={iconMap[current.weather[0].main]}
                        style={styles.mainIcon}
                    />

                    <Text style={styles.temp}>
                        {Math.round(current.main.temp)}°
                    </Text>

                    <Text style={styles.desc}>
                        {current.weather[0].description}
                    </Text>

                    {/* INFO GRID */}
                    <View style={styles.grid}>
                        <Info
                            icon={require("../assets/humidity.png")}
                            label="Humidity"
                            value={`${current.main.humidity}%`}
                        />

                        <Info
                            icon={require("../assets/wind.png")}
                            label="Wind"
                            value={`${current.wind.speed} m/s`}
                        />

                        <Info
                            icon={require("../assets/pressure.png")}
                            label="Pressure"
                            value={`${current.main.pressure}`}
                        />

                        <Info
                            icon={require("../assets/drop.png")}
                            label="Rain"
                            value={`${current?.rain?.["3h"] || 0}mm`}
                        />

                        <Info
                            icon={require("../assets/thermo.png")}
                            label="Feels"
                            value={`${Math.round(current.main.feels_like)}°`}
                        />

                        <Info
                            icon={require("../assets/vision.png")}
                            label="Visibility"
                            value={`${(current.visibility / 1000).toFixed(1)}km`}
                        />
                    </View>
                </>
            )}

            <Text style={styles.title}>5 Days Forecast</Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={forecast}
                keyExtractor={(i) => i.dt.toString()}
                renderItem={({ item, index }) => {
                    const date = new Date(item.dt * 1000);
                    const label = index === 0 ? "Today"
                        : date.toLocaleDateString();
                    return (
                        <View style={styles.forecastCard}>
                            <Text style={styles.date}>{label}</Text>

                            <Image
                                source={iconMap[item.weather[0].main]}
                                style={styles.smallIcon}
                            />

                            <Text style={styles.cardTemp}>
                                {Math.round(item.main.temp)}°
                            </Text>

                            <Text style={styles.weatherLabel}>
                                {item.weather[0].main}
                            </Text>
                        </View>
                    )
                }}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF4FF",
        paddingTop: 50,
    },

    back: {
        marginLeft: 15,
        color: "#007AFF",
    },

    city: {
        textAlign: "center",
        fontSize: 26,
        fontWeight: "bold",
    },

    mainIcon: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginVertical: 10,
    },

    temp: {
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center",
    },

    desc: {
        textAlign: "center",
        color: "#666",
        marginBottom: 15,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },

    infoCard: {
        width: "30%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 10,
        marginVertical: 8,
        alignItems: "center",
        elevation: 3,
    },

    infoIcon: {
        width: 24,
        height: 24,
        marginBottom: 4,
    },

    infoLabel: {
        fontSize: 11,
        color: "#777",
    },

    infoValue: {
        fontWeight: "bold",
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        margin: 15,
    },

    forecastCard: {
        width: 90,
        height: 100,
        backgroundColor: "#fff",
        marginHorizontal: 8,
        borderRadius: 16,
        alignItems: "center",
        padding: 10,
        elevation: 3,
    },

    smallIcon: {
        width: 40,
        height: 40,
    },

    cardTemp: {
        fontWeight: "bold",
    },

    date: {
        fontSize: 10,
        color: "#000",
        fontWeight: "bold",
    },

    weatherLabel: {
        fontSize: 11,
        color: "#777",
    }
});
