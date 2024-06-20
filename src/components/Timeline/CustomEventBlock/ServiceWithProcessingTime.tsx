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

	const animatedStyles = useAnimatedStyle(() => {
		const baseHeight = (event.duration * heightByTimeInterval.value) / totalSlotDuration;
	
		const applicationHeight = baseHeight * service.application_time;
		const processingHeight = baseHeight * service.processing_time;
		const finishingHeight = baseHeight * service.finishing_time;
	
		return {
		  application: {
			height: withTiming(applicationHeight, {
			  duration: eventAnimatedDuration
			}),
		  },
		  processing: {
			height: withTiming(processingHeight, {
			  duration: eventAnimatedDuration
			}),
		  },
		  finishing: {
			height: withTiming(finishingHeight, {
			  duration: eventAnimatedDuration
			}),
		  }
		};
	  }, [event]);
	
	return (
		<View style={{ flexDirection: "column" }}>
			<Animated.View
				style={animatedStyles.application}
			>
				{header}
			</Animated.View>

			<Animated.View
				style={animatedStyles.processing}
			>
				<CustomLineView strokeColor="white" strokeWidth="2" width={"100%"} height={100} />
			</Animated.View>

			<Animated.View
				style={animatedStyles.finishing}
			/>
		</View>
	);
};

export default ServiceWithProcessingTime;
