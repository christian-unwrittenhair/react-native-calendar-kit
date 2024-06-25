import React from "react";
import { Text, StyleSheet } from "react-native";

type ServiceNameProps = {
	name: string;
    time: string;
};

const ServiceName = ({
	name,
    time
}: ServiceNameProps) => {
	return (
		<Text style={styles.textContainer} numberOfLines={1}>
            <Text style={styles.time}>
                {time}
            </Text>
            {name}
        </Text>
	)
};

export default ServiceName;

const styles = StyleSheet.create({
    textContainer: {
        fontSize: 9,
		marginLeft: 5,
    },
    time: {
        fontSize: 9,
		marginLeft: 5,
    }
})
