import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { PackedEvent } from '../../types';

export interface EventBlockProps {
  event: PackedEvent;
  dayIndex: number;
  columnWidth: number;
  onPressEvent?: (eventItem: PackedEvent) => void;
  onLongPressEvent?: (eventItem: PackedEvent) => void;
  timeIntervalHeight: SharedValue<number>;
  renderEventContent?: (event: PackedEvent) => void;
  selectedEventId?: string;
}

const EVENT_DEFAULT_COLOR = '#FFFFFF';

const EventBlock = ({
  event,
  dayIndex,
  columnWidth,
  onPressEvent,
  onLongPressEvent,
  timeIntervalHeight,
  renderEventContent,
  selectedEventId,
}: EventBlockProps) => {
  const _onLongPress = () => {
    const eventParams = {
      ...event,
      top: event.top * timeIntervalHeight.value,
      height: event.height * timeIntervalHeight.value,
      leftByIndex: columnWidth * dayIndex,
    };
    onLongPressEvent?.(eventParams);
  };

  const _onPress = () => {
    const eventParams = {
      ...event,
      top: event.top * timeIntervalHeight.value,
      height: event.height * timeIntervalHeight.value,
      leftByIndex: columnWidth * dayIndex,
    };
    onPressEvent?.(eventParams);
  };

  const eventStyle = useAnimatedStyle(() => ({
    top: event.top * timeIntervalHeight.value,
    height: event.height * timeIntervalHeight.value,
  }));

  const _renderEventContent = () => {
    return <Text style={styles.title}>{event.title}</Text>;
  };

  const eventOpacity = selectedEventId ? 0.6 : 1;

  return (
    <Animated.View
      style={[
        styles.eventBlock,
        {
          left: event.left + columnWidth * dayIndex,
          width: event.width,
          opacity: eventOpacity,
        },
        event.containerStyle,
        eventStyle,
      ]}
    >
      <TouchableOpacity
        delayLongPress={300}
        disabled={!!selectedEventId}
        onPress={_onPress}
        onLongPress={_onLongPress}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: event.color || EVENT_DEFAULT_COLOR },
        ]}
        activeOpacity={0.6}
      >
        {renderEventContent ? renderEventContent(event) : _renderEventContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const areEqual = (prev: EventBlockProps, next: EventBlockProps) => {
  const isSameEvent = isEqual(prev.event, next.event);
  const isSameSelectedId = prev.selectedEventId === next.selectedEventId;
  const isSameColumnWidth = prev.columnWidth === next.columnWidth;
  const isSameDayIndex = prev.dayIndex === next.dayIndex;
  return isSameEvent && isSameSelectedId && isSameColumnWidth && isSameDayIndex;
};

export default memo(EventBlock, areEqual);

const styles = StyleSheet.create({
  eventBlock: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: { paddingVertical: 4, paddingHorizontal: 2, fontSize: 10 },
});