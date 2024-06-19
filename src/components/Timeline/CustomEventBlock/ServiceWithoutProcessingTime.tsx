import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTimelineCalendarContext } from "../../../context/TimelineProvider"
import type { ServiceProps } from "./Service"

const ServiceWithoutProcessingTime = ({
	event,
	service,
	totalSlotDuration,
	header
}: ServiceProps) => {
	const {
		heightByTimeInterval,
		eventAnimatedDuration
	} = useTimelineCalendarContext();

	const styles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.duration

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			}),
		}
	}, [event])
	
	return (
		<View style={{ flexDirection: "column" }}>
			<Animated.View
				style={styles}
			>
				{header}
			</Animated.View>
		</View>
	);
};

export default ServiceWithoutProcessingTime;
