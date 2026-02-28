import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from "react-native";
import { useState } from "react";
import WeatherCard from "../components/weatherCard";
import { useRouter } from "expo-router";

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY!;
const WEATHER_API_URL = process.env.EXPO_PUBLIC_WEATHER_API_URL!;

export default function Home() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const fetchWeather = async () => {
        try {
            setError("");

            const res = await fetch(
                `${WEATHER_API_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
            );

            const data = await res.json();

            if (data.cod !== 200) {
                setWeather(null);
                setError("City not found");
                return;
            }

            setWeather(data);
        } catch {
            setError("Network error");
        }
    };

    return (
        <ImageBackground
            source={require("../assets/background-sky.jpg")} // đặt ảnh trong assets
            style={styles.container}
            resizeMode="cover"
        >
            {/* Lớp phủ làm chữ dễ nhìn */}
            <View style={styles.overlay}>
                <Text style={styles.title}>Weather App</Text>

                <TextInput
                    placeholder="Enter city..."
                    placeholderTextColor="#150f0f"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                />
                <Text style={styles.sectionTitle}>Popular Cities</Text>

                <View style={styles.suggestContainer}>
                    {["Ho Chi Minh", "Hanoi", "Tokyo", "London"].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.suggestBtn}
                            onPress={() => {
                                setCity(item);
                                fetchWeather();
                            }}
                        >
                            <Text style={styles.suggestText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Search</Text>
                </TouchableOpacity>

                {weather && (
                    <WeatherCard
                        data={weather}
                        onPress={() => router.push(`/detail?city=${city}`)}
                    />
                )}
                {!weather && (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyTitle}>Check today's weather</Text>
                        <Text style={styles.emptyDesc}>
                            Enter a city to see temperature, humidity and forecast
                        </Text>
                    </View>
                )}
                {error !== "" && <Text style={styles.error}>{error}</Text>}
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    overlay: {
        flex: 1,
        width: "100%",
        paddingTop: 80,
        paddingHorizontal: 20,
        backgroundColor: "rgba(0,0,0,0.25)", // phủ nhẹ toàn màn hình
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
        color: "#fff",
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 14,
        borderRadius: 12,
        marginBottom: 15,
    },

    button: {
        backgroundColor: "#007bffcb",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 30,
    },

    error: {
        color: "#ff4d4d",
        textAlign: "center",
        marginTop: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },

    suggestContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },

    suggestBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    suggestText: {
        color: "#fff",
    },
    emptyBox: {
        marginTop: 50,
        padding: 25,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
    },

    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },

    emptyDesc: {
        color: "#e0f7ff",
    },
});