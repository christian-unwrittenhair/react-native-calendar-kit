import React from "react";
import { View } from "react-native";
import CustomLineView from "./CustomLineView";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTimelineCalendarContext } from "../../../context/TimelineProvider"
import type { ServiceProps } from "./Service"

const ServiceWithProcessingTime = ({
	event,
	service,
	totalSlotDuration,
	header,
}: ServiceProps) => {

	const {
		heightByTimeInterval,
		eventAnimatedDuration
	} = useTimelineCalendarContext();

	const applicationTimeStyles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.application_time

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			}),
		}
	}, [event])

	const processingTimeStyles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.processing_time

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			}),
		}
	}, [event])

	const finishingTimeStyles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.finishing_time

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			}),
		}
	}, [event])
	
	return (
		<View style={{ flexDirection: "column" }}>
			<Animated.View
				style={applicationTimeStyles}
			>
				{header}
			</Animated.View>

			<Animated.View
				style={processingTimeStyles}
			>
				<CustomLineView strokeColor="white" strokeWidth="2" width={"100%"} height={100} />
			</Animated.View>

			<Animated.View
				style={finishingTimeStyles}
			/>
		</View>
	);
};

export default ServiceWithProcessingTime;
