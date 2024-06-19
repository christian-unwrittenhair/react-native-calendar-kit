import React from "react";
import { Svg, Line } from "react-native-svg";

interface CustomLineViewProps {
	strokeWidth: string;
	strokeColor: string;
	width: Number;
	height: Number;
}

const CustomLineView = ({ strokeWidth, strokeColor, width, height }: CustomLineViewProps) => {
	return (
		<Svg height={"100%"} width={width.toString()}>
			<Line x1="10" y1="0" x2="0" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="20" y1="0" x2="0" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="30" y1="0" x2="0" y2="30" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="40" y1="0" x2="0" y2="40" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="50" y1="0" x2="0" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="60" y1="0" x2="0" y2="60" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="70" y1="0" x2="0" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="80" y1="0" x2="0" y2="80" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="90" y1="0" x2="0" y2="90" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="100" y1="0" x2="0" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="110" y1="0" x2="0" y2="110" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="120" y1="0" x2="0" y2="120" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="130" y1="0" x2="0" y2="130" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="140" y1="0" x2="0" y2="140" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="150" y1="0" x2="0" y2="150" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="160" y1="0" x2="0" y2="160" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="170" y1="0" x2="0" y2="170" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="180" y1="0" x2="0" y2="180" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="190" y1="0" x2="0" y2="190" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="200" y1="0" x2="0" y2="200" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="210" y1="0" x2="0" y2="210" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="220" y1="0" x2="0" y2="220" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="230" y1="0" x2="0" y2="230" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="240" y1="0" x2="0" y2="240" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="250" y1="0" x2="0" y2="250" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="260" y1="0" x2="0" y2="260" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="270" y1="0" x2="0" y2="270" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="280" y1="0" x2="0" y2="280" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="290" y1="0" x2="0" y2="290" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="300" y1="0" x2="0" y2="300" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="310" y1="0" x2="0" y2="310" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="320" y1="0" x2="0" y2="320" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="330" y1="0" x2="0" y2="330" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="340" y1="0" x2="0" y2="340" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="350" y1="0" x2="0" y2="350" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="360" y1="0" x2="0" y2="360" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="370" y1="0" x2="0" y2="370" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="380" y1="0" x2="0" y2="380" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="390" y1="0" x2="0" y2="390" stroke={strokeColor} strokeWidth={strokeWidth} />
			<Line x1="400" y1="0" x2="0" y2="400" stroke={strokeColor} strokeWidth={strokeWidth} />
		</Svg>
	);
};

export default CustomLineView;
