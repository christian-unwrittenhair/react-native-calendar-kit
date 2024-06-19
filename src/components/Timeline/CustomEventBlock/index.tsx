import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../../constants';
import type { PackedEvent, ThemeProperties } from '../../../types';
import { shallowEqual } from '../../../utils';
import Service from "./Service"
import Header from "./Header"
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';

export interface EventBlockProps {
  event: PackedEvent;
  dayIndex: number;
  columnWidth: number;
  onPressEvent?: (eventItem: PackedEvent) => void;
  onLongPressEvent?: (eventItem: PackedEvent) => void;
  timeIntervalHeight: SharedValue<number>;
  renderEventContent?: (
    event: PackedEvent,
    timeIntervalHeight: SharedValue<number>
  ) => JSX.Element;
  selectedEventId?: string;
  theme: ThemeProperties;
  eventAnimatedDuration?: number;
  isPinchActive: SharedValue<boolean>;
  heightByTimeInterval: SharedValue<number>;
}

const EVENT_DEFAULT_COLOR = '#FFFFFF';

const EventBlock = ({
  event,
  dayIndex,
  columnWidth,
  onPressEvent,
  onLongPressEvent,
  renderEventContent,
  theme,
  selectedEventId,
  eventAnimatedDuration,
  isPinchActive,
  timeIntervalHeight,
  heightByTimeInterval,
}: EventBlockProps) => {
  const {
    tzOffset
  } = useTimelineCalendarContext();

  let accumulatedServiceDuration = 0;
	let totalDuration = event.services.reduce((acc: number, cur) => acc + cur.duration, 0);

  const _onLongPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex,
    };
    onLongPressEvent?.(eventParams);
  };

  const _onPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex,
    };
    onPressEvent?.(eventParams);
  };

  const eventStyle = useAnimatedStyle(() => {
    let eventHeight = event.duration * heightByTimeInterval.value;

    if (theme.minimumEventHeight) {
      eventHeight = Math.max(theme.minimumEventHeight, eventHeight);
    }

    if (isPinchActive.value) {
      return {
        top: event.startHour * heightByTimeInterval.value,
        height: eventHeight,
        left: event.left + columnWidth * dayIndex,
        width: event.width,
      };
    }

    return {
      top: withTiming(event.startHour * heightByTimeInterval.value, {
        duration: eventAnimatedDuration,
      }),
      height: withTiming(eventHeight, {
        duration: eventAnimatedDuration,
      }),
      left: withTiming(event.left + columnWidth * dayIndex, {
        duration: eventAnimatedDuration,
      }),
      width: withTiming(event.width, {
        duration: eventAnimatedDuration,
      }),
    };
  }, [event]);

  const renderServices = (service, index: number) => {
    accumulatedServiceDuration += index === 0 ? 0 : event.services[index - 1].duration;
    return (
      <Animated.View
        key={index}
        style={{
          borderTopWidth: index === 0 ? 0 : 0.5,
          borderTopColor: "black",
        }}
      >
        <TouchableOpacity onPress={undefined}>
          <Service
            event={event}
            service={service}
            totalSlotDuration={totalDuration}
            header={(
              <Header
                event={event}
                isFirst={index === 0}
                showCustomerDetail={index === 0}
                duration={accumulatedServiceDuration}
                serviceName={service.name}
                timezone={tzOffset}
              />
            )}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const _renderEventContent = () => {
    return (
      <View
        style={
          event.consumer == null
            ? styles.taskBox
            : {
                backgroundColor: event.background_color,
                flex: 1,
              }
        }
      >
        <View style={{ flexDirection: "column" }}>
          {event.services.map(renderServices)}
        </View>
      </View>
    );
  }

  const eventOpacity = selectedEventId ? 0.5 : 1;

  return (
    <Animated.View
      style={[
        styles.eventBlock,
        { opacity: eventOpacity },
        event.containerStyle,
        eventStyle,
      ]}
    >
      <TouchableOpacity
        disabled={!!selectedEventId}
        delayLongPress={300}
        onPress={_onPress}
        onLongPress={_onLongPress}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: event.color || EVENT_DEFAULT_COLOR },
        ]}
        activeOpacity={0.6}
      >
        {renderEventContent
          ? renderEventContent(event, timeIntervalHeight)
          : _renderEventContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const areEqual = (prev: EventBlockProps, next: EventBlockProps) => {
  const { event: prevEvent, theme: prevTheme, ...prevOther } = prev;
  const { event: nextEvent, theme: nextTheme, ...nextOther } = next;
  const isSameEvent = isEqual(prevEvent, nextEvent);
  const isSameTheme = isEqual(prevTheme, nextTheme);
  const isSameOther = shallowEqual(prevOther, nextOther);
  return isSameEvent && isSameTheme && isSameOther;
};

export default memo(EventBlock, areEqual);

const styles = StyleSheet.create({
  eventBlock: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR,
  },
  taskBox: {
		backgroundColor: "#f5f5f5",
		flex: 1,
		borderLeftWidth: 1,
		borderLeftColor: "black",
		borderWidth: 2,
		borderColor: "#E0E0E0",
	},
});
