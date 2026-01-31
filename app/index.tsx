import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import WeatherCard from "../components/weatherCard";
import { useRouter } from "expo-router";

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY!;
const WEATHER_API_URL = process.env.EXPO_PUBLIC_WEATHER_API_URL!;

export default function Home() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<any>(null);
    const router = useRouter();
    const [error, setError] = useState("");

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
        <View style={styles.container}>
            <Text style={styles.title}>Weather App</Text>

            <TextInput
                placeholder="Enter city..."
                style={styles.input}
                value={city}
                onChangeText={setCity}
            />

            <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Search</Text>
            </TouchableOpacity>

            {weather && (
                <WeatherCard
                    data={weather}
                    onPress={() => router.push(`/detail?city=${city}`)}
                />
            )}
            {error !== "" && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
        backgroundColor: "#EAF3FF",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },

    input: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        marginBottom: 15,
    },

    button: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 30,
    },

    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
});
