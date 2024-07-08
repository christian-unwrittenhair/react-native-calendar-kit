import moment from 'moment-timezone';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import type { PackedEvent, ThemeProperties, UnavailableHour } from '../../types';
import { uniqBy, flatten } from "lodash";

interface DragCreateItemProps {
  offsetX: SharedValue<number>;
  offsetY: SharedValue<number>;
  currentHour: SharedValue<number>;
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
    events,
    pages,
    viewMode,
    currentIndex,
    unavailableHours,
    tzOffset
  } = useTimelineCalendarContext();

  //prepares the events data structure for easier checking later on
  const currentDateSlots = useMemo(
    () => {
      let workHours: UnavailableHour[] = []
      const currentDate = pages[viewMode].data[currentIndex.value]
      if(currentDate) {
        if(unavailableHours) {
          workHours = flatten(Object.values(unavailableHours))
        }

        const result = events

        //only include the slots on the current selected date
        .filter((eventItem) => eventItem.start.includes(currentDate))
        .flatMap(eventItem => {

          const services = eventItem.consumer ? eventItem.services : [{ has_processing_time: false, duration: moment(eventItem.end).diff(moment(eventItem.start), 'minutes') }]
          
          return services.flatMap((service: any) => {
            const application_time = service.application_time ? parseInt(service.application_time) : 0
            const processing_time = service.processing_time ? parseInt(service.processing_time) : 0
            const finishing_time = service.finishing_time ? parseInt(service.finishing_time) : 0

            const sections = []

            if(application_time) sections.push({ start: 0, end: application_time })
            if(finishing_time) sections.push({ start: application_time + processing_time, end: finishing_time })
            if(!service.has_processing_time) sections.push({ start: 0, end: service.duration })
            
            return sections.map((section) => {
              const formattedStart = moment.tz(eventItem.start, tzOffset).add(section.start, 'minutes').format("HH:mm")
              const formattedEnd = moment.tz(eventItem.start, tzOffset).add(section.start + section.end, 'minutes').format("HH:mm")

              const startSplit = formattedStart.split(":")
              const endSplit = formattedEnd.split(":")

              const parsedStartMinutes = parseInt(String(startSplit[1]))
              const parsedEndMinutes = parseInt(String(endSplit[1]))
              
              const startMinutes = parsedStartMinutes > 0 ? parsedStartMinutes / 60 : 0
              const endMinutes = parsedEndMinutes > 0 ? parsedEndMinutes / 60 : 0

              return {
                start: parseFloat(startSplit[0]) + parseFloat(startMinutes),
                end: parseFloat(endSplit[0]) + parseFloat(endMinutes),
              }
            })
          })
        })

        //remove duplicate slots so there are lesser items to loop when doing checks
        return uniqBy([...result, ...workHours], (slot) => `${slot.start}-${slot.end}`)
      }
      return workHours
    },
    [events, currentIndex.value, unavailableHours]
  );

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

      isSlotTaken = currentDateSlots.some(slot => startTime < slot.end && slot.start < endTime)
    }

    return {
      height:
        (event ? event.duration : dragCreateInterval / 60) *
        heightByTimeInterval.value,
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
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
