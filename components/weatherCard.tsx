import { Text, StyleSheet, Image, Pressable } from "react-native";
import { router } from "expo-router";

export default function WeatherCard({ data }: any) {
    if (!data || !data.weather || !data.weather.length) return null;

    const desc = data.weather?.[0]?.main;

    const iconMap: any = {
        Clear: require("../assets/sun.webp"),
        Clouds: require("../assets/cloud.webp"),
        Rain: require("../assets/rain.png"),
        Snow: require("../assets/snow.png"),
    };

    return (
        <Pressable
            style={styles.card}
            onPress={() =>
                router.push({ pathname: "/detail", params: { city: data.name } })
            }
        >
            <Text style={styles.city}>{data.name}</Text>

            <Image
                source={iconMap[desc] || iconMap.Clouds}
                style={{ width: 60, height: 60 }}
            />

            <Text style={styles.temp}>{Math.round(data.main.temp)}°C</Text>
            <Text style={styles.desc}>{desc}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    card: {
        borderRadius: 28,
        padding: 24,
        marginTop: 30,
        alignItems: "center",

        // Glass effect
        backgroundColor: "rgba(255,255,255,0.18)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",

        // Shadow
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 10,
    },

    city: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
    },

    temp: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#fff",
        marginVertical: 6,
    },

    desc: {
        color: "rgba(255,255,255,0.85)",
        textTransform: "capitalize",
    },
});