import React from "react";
import type { PackedEvent } from "../../../types"
import ServiceWithProcessingTime from "./ServiceWithProcessingTime";
import ServiceWithoutProcessingTime from "./ServiceWithoutProcessingTime";

export type ServiceProps = {
	event: PackedEvent;
	service: any;
	totalSlotDuration: number;
	header: JSX.Element;
};

const Service = (props: ServiceProps) => {
	
	if(props.service.has_processing_time) {
		return (
			<ServiceWithProcessingTime {...props} />
		)
	}

	return (
		<ServiceWithoutProcessingTime {...props} />
	)
};

export default Service;
