import moment from 'moment-timezone';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import type { PackedEvent, ThemeProperties } from '../../types';
import { useGetSlotsForTheCurrentDate } from '../../hooks/useGetSlotsForTheCurrentDate'

interface DragCreateItemProps {
  offsetX: SharedValue<number>;
  offsetY: SharedValue<number>;
  currentHour: SharedValue<number>;
  currentDate: SharedValue<string>;
  event?: PackedEvent;
  renderEventContent?: (
    event: PackedEvent,
    timeIntervalHeight: SharedValue<number>
  ) => JSX.Element;
}

export const DragCreateItem = ({
  offsetX,
  offsetY,
  currentHour,
  currentDate,
  event,
  renderEventContent,
}: DragCreateItemProps) => {
  const {
    columnWidth,
    hourWidth,
    heightByTimeInterval,
    dragCreateInterval,
    theme,
    hourFormat,
    viewMode,
  } = useTimelineCalendarContext();

  //prepares the events data structure for easier checking later on
  const currentDateSlots = useGetSlotsForTheCurrentDate();

  const animatedStyles = useAnimatedStyle(() => {
    const curHour = currentHour.value

    let isSlotTaken = false

    if(event) {
      let extra = 0;
      if (curHour < 0) {
        extra = 24;
      } else if (curHour >= 24) {
        extra = -24;
      }
      const convertedTime = curHour + extra;
      const rHours = Math.floor(convertedTime);
      const minutes = (convertedTime - rHours) * 60;
      const rMinutes = Math.round(minutes);
      const offset = rHours < 0 ? 24 : 0;
      const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
      const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;

      const startTime = parseFloat(hourStr) + parseFloat(minutesStr / 60)
      const endTime = startTime + (event.duration)

      isSlotTaken = currentDateSlots.some(slot => 
        (
          slot.id !== event.id &&
          slot.date === currentDate.value &&
          startTime < slot.end && 
          slot.start < endTime
        )
      )
    }

    // this ensures that in day view, the mask is horizontally positioned on the most left side
    const translateX = viewMode === 'week' ? offsetX.value : 0

    return {
      height:
        (event ? event.duration : dragCreateInterval / 60) *
        heightByTimeInterval.value,
      transform: [{ translateX }, { translateY: offsetY.value }],
      backgroundColor: event ? (isSlotTaken ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 255, 0, 0.4)") : theme.dragCreateItemBackgroundColor
    };
  });
  
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          styles.defaultStyle,
          {
            left: hourWidth,
            width: columnWidth,
            ...(!event && {
            }),
          },
          animatedStyles,
        ]}
      >
        {event && (
          <>
            {!!renderEventContent &&
              renderEventContent(event, heightByTimeInterval)}
            {!renderEventContent && (
              <Text style={[styles.title, theme.eventTitle]}>
                {event.title}
              </Text>
            )}
          </>
        )}  
      </Animated.View>
      <AnimatedHour
        currentHour={currentHour}
        offsetY={offsetY}
        hourWidth={hourWidth}
        theme={theme}
        hourFormat={hourFormat}
      />
    </View>
  );
};

export default DragCreateItem;

interface AnimatedHourProps {
  currentHour: Animated.SharedValue<number>;
  offsetY: Animated.SharedValue<number>;
  hourWidth: number;
  theme: ThemeProperties;
  hourFormat?: string;
}

const AnimatedHour = ({
  currentHour,
  offsetY,
  hourWidth,
  theme,
  hourFormat,
}: AnimatedHourProps) => {
  const [time, setTime] = useState('');

  const _onChangedTime = (
    hourStr: string | number,
    minutesStr: string | number
  ) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = moment(
        `1970/1/1 ${hourStr}:${minutesStr}`,
        'YYYY/M/D HH:mm'
      ).format(hourFormat);
    }
    setTime(newTime);
  };

  useAnimatedReaction(
    () => currentHour.value,
    (hour) => {
      let extra = 0;
      if (hour < 0) {
        extra = 24;
      } else if (hour >= 24) {
        extra = -24;
      }
      const convertedTime = hour + extra;
      const rHours = Math.floor(convertedTime);
      const minutes = (convertedTime - rHours) * 60;
      const rMinutes = Math.round(minutes);
      const offset = rHours < 0 ? 24 : 0;
      const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
      const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
      runOnJS(_onChangedTime)(hourStr, minutesStr);
    }
  );

  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.hourContainer,
        { width: hourWidth - 8 },
        theme.dragHourContainer,
        animatedTextStyles,
      ]}
    >
      <Text
        allowFontScaling={theme.allowFontScaling}
        style={[styles.hourText, theme.dragHourText]}
      >
        {time}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
    left: 0,
  },
  hourContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4,
    borderColor: DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
  },
  hourText: {
    color: DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10,
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR,
  },
});
