import React from "react";
import moment from "moment-timezone"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import type { PackedEvent } from "../../../types"
import ServiceName from "./ServiceName"
import CustomerName from "./CustomerName"
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';

type HeaderProps = {
	event: PackedEvent;
	showCustomerDetail: boolean;
	serviceName: any;
	timezone: string;
	isFirst: boolean;
	duration: number;
};

const Header = ({
	event,
	showCustomerDetail,
	serviceName,
	timezone,
	isFirst,
	duration
}: HeaderProps) => {
	const {
		heightByTimeInterval,
		eventAnimatedDuration
	} = useTimelineCalendarContext();

	const serviceNameStyles = useAnimatedStyle(() => {
		const height = heightByTimeInterval.value < 80 ? 0 : 12

		return {
			height: withTiming(height, {
				duration: eventAnimatedDuration
			}),
		}
	}, [event])

	return (
		<>
			{showCustomerDetail && (
				<CustomerName
					eventTitle={String(event.title)}
					customer={event.consumer || undefined}
				/>
			)}
			
			<Animated.View style={serviceNameStyles}>
				<ServiceName
					name={serviceName}
					time={`${moment
						.tz(event.start, timezone)
						.add(isFirst ? 0 : duration, "minutes")
						.format("hh:mm A")} `
					}
				/>
			</Animated.View>
		</>
	)
};

export default Header;
