import { Text, StyleSheet, Image, Pressable } from "react-native";
import { router } from "expo-router";

export default function WeatherCard({ data }: any) {
    if (!data || !data.weather || !data.weather.length) return null;

    const desc = data.weather?.[0]?.main;

    const iconMap: any = {
        Clear: require("../assets/sun.png"),
        Clouds: require("../assets/cloud.png"),
        Rain: require("../assets/rain.png"),
        Snow: require("../assets/snow.png"),
    };


    return (
        <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/detail", params: { city: data.name } })}
        >
            <Text style={styles.city}>{data.name}</Text>

            <Image
                source={iconMap[data.main] || iconMap.Clouds}
                style={{ width: 60, height: 60 }}
            />

            <Text style={styles.temp}>{Math.round(data.main.temp)}°C</Text>

            <Text style={styles.desc}>{desc}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        alignItems: "center",
        elevation: 4,
    },

    city: {
        fontSize: 20,
        fontWeight: "600",
    },

    icon: {
        width: 80,
        height: 80,
    },

    temp: {
        fontSize: 32,
        fontWeight: "bold",
    },

    desc: {
        color: "#666",
    },
});
