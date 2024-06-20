import React from "react";
import moment from "moment-timezone"
import type { PackedEvent } from "../../../types"
import ServiceName from "./ServiceName"
import CustomerName from "./CustomerName"

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
	return (
		<>
			{showCustomerDetail && (
				<CustomerName
					eventTitle={String(event.title)}
					customer={event.consumer || undefined}
				/>
			)}

			<ServiceName
				name={serviceName}
				time={`${moment
					.tz(event.start, timezone)
					.add(isFirst ? 0 : duration, "minutes")
					.format("hh:mm A")} `
				}
			/>
		</>
	)
};

export default Header;
