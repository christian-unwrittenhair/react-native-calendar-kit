import React, { memo } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import type { ThemeProperties } from '../../types';
import { convertPositionToISOString } from "../../utils"

export type HourItem = { text: string; hourNumber: number };

type TimelineHoursProps = {
  startDate?: string;
  onPress?(date: string): void;
}

const TimelineHours = ({ startDate, onPress }: TimelineHoursProps) => {
  const { hours, hourWidth, timeIntervalHeight, spaceFromTop, theme, heightByTimeInterval, columnWidth } =
    useTimelineCalendarContext();

  const _renderHour = (hour: HourItem, index: number) => {
    return (
      <HourItem
        key={index}
        hour={hour}
        index={index}
        timeIntervalHeight={timeIntervalHeight}
        spaceContent={spaceFromTop}
        theme={theme}
      />
    );
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!event.nativeEvent.locationX || !event.nativeEvent.locationY) {
      return;
    }
    if(startDate) {
      const dateIsoString = convertPositionToISOString(
        event.nativeEvent.locationX,
        event.nativeEvent.locationY,
        startDate,
        heightByTimeInterval.value,
        columnWidth
      );
      onPress?.(dateIsoString)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.hours,
          {
            width: hourWidth,
            backgroundColor: theme.backgroundColor,
            marginBottom: spaceFromTop,
          },
        ]}
      >
        {hours.map(_renderHour)}
        <View
          style={[
            styles.verticalLine,
            { top: spaceFromTop, backgroundColor: theme.cellBorderColor },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(TimelineHours);

const HourItem = ({
  hour,
  index,
  timeIntervalHeight,
  spaceContent,
  theme,
}: {
  hour: HourItem;
  index: number;
  timeIntervalHeight: SharedValue<number>;
  spaceContent: number;
  theme: ThemeProperties;
}) => {
  const hourLabelStyle = useAnimatedStyle(() => {
    return { top: timeIntervalHeight.value * index - 6 + spaceContent };
  });

  return (
    <Animated.Text
      allowFontScaling={theme.allowFontScaling}
      key={`hourLabel_${hour.text}`}
      style={[styles.hourText, theme.hourText, hourLabelStyle]}
    >
      {hour.text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  hours: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  hourText: {
    position: 'absolute',
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR,
  },
  verticalLine: {
    width: 1,
    backgroundColor: DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%',
  },
});
