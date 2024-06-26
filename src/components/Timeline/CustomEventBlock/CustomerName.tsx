import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Customer = {
    first_name: string;
    last_name: string;
}

type CustomerNameProps = {
    eventTitle: string;
    customer?: Customer;
};

const CustomerName = ({
    eventTitle,
    customer
}: CustomerNameProps) => {

	const getName = (o: any) => {
		let name = o?.first_name;
		if (name && o?.last_name) {
			name += ` ${o?.last_name}`;
		} else if (!name) {
			name = o?.last_name;
		}
		return name;
	};

    return (
        <View style={styles.container}>
            {customer ? (
                <>
                    <View style={styles.slotContainer}>
                        <Image source={require("./u_user.png")} style={styles.image} />
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{getName(customer)}</Text>
                </>
            ) : (
                <View style={styles.taskContainer}>
                    <Text style={styles.title} numberOfLines={1}>{eventTitle}</Text>
                    <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                        <Image source={require("./task_image.png")} />
                    </View>
                </View>
            )}
        </View>
    )
};

export default CustomerName;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
		alignItems: "center",
		height: 12,
    },
    image: {
        width: "90%",
		height: "90%",
		resizeMode: "contain",
		borderRadius: 20,
    },
    title: {
        flex: 1,
        fontSize: 10,
		textTransform: "capitalize",
		marginLeft: 2,
        fontWeight: "bold"
    },
    slotContainer: {
        width: 15,
		marginLeft: 5,
    },
    taskContainer: {
        marginLeft: 15,
		flexDirection: "row",
		alignItems: "center",
    }
})