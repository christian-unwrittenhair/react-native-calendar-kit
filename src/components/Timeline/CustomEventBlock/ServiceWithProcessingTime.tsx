import React from "react";
import { View, TouchableOpacity } from "react-native";
import CustomLineView from "./CustomLineView";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTimelineCalendarContext } from "../../../context/TimelineProvider"
import type { ServiceProps } from "./Service"

const ServiceWithProcessingTime = ({
	event,
	service,
	totalSlotDuration,
	header,
	onPressEventService
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
			})
		}
	  }, [event, heightByTimeInterval])

	  const processingTimeStyles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.processing_time

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			})
		}
	  }, [event, heightByTimeInterval])

	  const finishingTimeStyles = useAnimatedStyle(() => {
		const height = ((event.duration * heightByTimeInterval.value) / totalSlotDuration) * service.finishing_time

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			})
		}
	  }, [event, heightByTimeInterval])

	const handlePressProcessingTime = () => onPressEventService?.(event, service)
	
	return (
		<View style={{ flexDirection: "column" }}>
			<Animated.View
				style={applicationTimeStyles}
			>
				{header}
			</Animated.View>

			<TouchableOpacity disabled={!onPressEventService} onPress={handlePressProcessingTime}>
				<Animated.View
					style={processingTimeStyles}
				>
					<CustomLineView strokeColor="white" strokeWidth="2" width={"100%"} height={100} />
				</Animated.View>
			</TouchableOpacity>

			<Animated.View
				style={finishingTimeStyles}
			/>
		</View>
	);
};

export default ServiceWithProcessingTime;
