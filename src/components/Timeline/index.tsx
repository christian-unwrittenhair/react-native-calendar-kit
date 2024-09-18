import moment from 'moment-timezone';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedReaction, withTiming, runOnJS } from 'react-native-reanimated';
import { timeZoneData } from '../../assets/timeZone';
import { COLUMNS, DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import useDragCreateGesture from '../../hooks/useDragCreateGesture';
import useZoomGesture from '../../hooks/usePinchGesture';
import useTimelineScroll from '../../hooks/useTimelineScroll';
import type {
  PackedEvent,
  TimelineCalendarHandle,
  TimelineProps,
} from '../../types';
import { clampValues, groupEventsByDate } from '../../utils';
import DragCreateItem from './DragCreateItem';
import TimelineHeader from './TimelineHeader';
import TimelineSlots from './TimelineSlots';

const DEVICE_HEIGHT = Dimensions.get('window').height

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const Timeline: React.ForwardRefRenderFunction<TimelineCalendarHandle, TimelineProps> = (
  {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    isLoading,
    events,
    selectedEvent,
    highlightDates,
    onChange,
    onTimeIntervalHeightChange,
    onLongPressEvent,
    ...other
  },
  ref
) => {
  const {
    timelineLayoutRef,
    minTimeIntervalHeight,
    theme,
    totalHours,
    allowDragToCreate,
    firstDate,
    viewMode,
    totalPages,
    timelineHorizontalListRef,
    timeIntervalHeight,
    spaceFromTop,
    allowPinchToZoom,
    scrollToNow,
    initialDate,
    isShowHeader,
    currentIndex,
    pages,
    tzOffset,
    maxTimeIntervalHeight,
    updateCurrentDate,
    offsetY,
    timelineVerticalListRef,
    initialTimeIntervalHeight,
    heightByTimeInterval,
    start,
    verticalListRef,
    allowEventHoldToDragEvent,
    isDragCreateActive,
    columnWidth
  } = useTimelineCalendarContext();
  const { goToNextPage, goToPrevPage, goToOffsetY } = useTimelineScroll();

  useImperativeHandle<TimelineCalendarHandle, TimelineCalendarHandle>(
    ref,
    () => ({
      goToDate: (props?: {
        date?: string;
        hourScroll?: boolean;
        animatedDate?: boolean;
        animatedHour?: boolean;
      }) => {
        const numOfDays = viewMode === 'workWeek' ? COLUMNS.week : COLUMNS[viewMode];
        const currentDay = moment.tz(props?.date, tzOffset);
        const firstDateMoment = moment.tz(firstDate.current[viewMode], tzOffset);
        const diffDays = currentDay.clone().startOf('D').diff(firstDateMoment, 'd');
        const pageIndex = Math.floor(diffDays / numOfDays);
        if (pageIndex < 0 || pageIndex > totalPages[viewMode] - 1) {
          return;
        }

        timelineHorizontalListRef.current?.scrollToIndex({
          index: pageIndex,
          animated: props?.animatedDate,
        });

        if (props?.hourScroll) {
          const minutes = currentDay.hour() * 60 + currentDay.minute();
          const subtractMinutes = minutes - start * 60;
          const position = (subtractMinutes * timeIntervalHeight.value) / 60 + spaceFromTop;
          const offset = timelineLayoutRef.current.height / 2;
          goToOffsetY(Math.max(0, position - offset), props?.animatedHour);
          verticalListRef.current?.scrollTo({ x: 0, y: position - offset, animated: props?.animatedHour });
        }
      },
      goToNextPage: goToNextPage,
      goToPrevPage: goToPrevPage,
      getZones: () => Object.values(timeZoneData),
      cancelDrag: () => {
        dragXPosition.value = 0;
        dragYPosition.value = 0;
        currentHour.value = 0;
        setDraggingEvent(null);
        setIsDraggingCreate(false);
        isDragCreateActive.value = false
        gestureEvent.value = undefined;
      },
      getZone: (key: keyof typeof timeZoneData) => timeZoneData[key],
      getHour: () => {
        const position = Math.max(0, offsetY.value - spaceFromTop + 8);
        const minutes = (position * 60) / heightByTimeInterval.value;
        const hour = minutes / 60 + start;
        return Math.max(0, hour);
      },
      getDate: () => {
        const numOfDays = viewMode === 'workWeek' ? COLUMNS.week : COLUMNS[viewMode];
        const firstDateMoment = moment.tz(firstDate.current[viewMode], tzOffset);
        const pageIndex = currentIndex.value;
        const currentDay = firstDateMoment.add(pageIndex * numOfDays, 'd');
        return currentDay.toISOString();
      },
      goToHour: (hour: number, animated?: boolean) => {
        const minutes = (hour - start) * 60;
        const position = (minutes * heightByTimeInterval.value) / 60 + spaceFromTop;
        goToOffsetY(Math.max(0, position - 8), animated);
        verticalListRef.current?.scrollTo({ x: 0, y: position - 8, animated: true });
      },
      forceUpdateNowIndicator: updateCurrentDate,
      zoom: (props?: { scale?: number; height?: number }) => {
        let newHeight = props?.height ?? initialTimeIntervalHeight;
        if (props?.scale) {
          newHeight = timeIntervalHeight.value * props.scale;
        }
        const clampedHeight = clampValues(
          newHeight,
          minTimeIntervalHeight.value,
          maxTimeIntervalHeight
        );
        const pinchYNormalized = offsetY.value / timeIntervalHeight.value;
        const pinchYScale = clampedHeight * pinchYNormalized;
        const y = pinchYScale;
        verticalListRef.current?.scrollTo({ x: 0, y, animated: true });
        timeIntervalHeight.value = withTiming(clampedHeight);
      },
    }),
    [
      goToNextPage,
      goToPrevPage,
      updateCurrentDate,
      viewMode,
      tzOffset,
      firstDate,
      totalPages,
      timelineHorizontalListRef,
      start,
      timeIntervalHeight,
      spaceFromTop,
      timelineLayoutRef,
      goToOffsetY,
      offsetY.value,
      heightByTimeInterval.value,
      currentIndex.value,
      initialTimeIntervalHeight,
      minTimeIntervalHeight.value,
      maxTimeIntervalHeight,
      timelineVerticalListRef,
      verticalListRef,
    ]
  );

  useAnimatedReaction(
    () => timeIntervalHeight.value,
    (next, prev) => {
      if (next === prev || !onTimeIntervalHeightChange) {
        return;
      }
      runOnJS(onTimeIntervalHeightChange)(next);
    },
    [onTimeIntervalHeightChange]
  );

  useEffect(() => {
    if (!timelineLayoutRef.current.height) {
      return;
    }
    requestAnimationFrame(() => {
      const current = moment.tz(tzOffset);
      const isSameDate = current.format('YYYY-MM-DD') === initialDate.current;
      if (scrollToNow && isSameDate) {
        const minutes = current.hour() * 60 + current.minute();
        const subtractMinutes = minutes - start * 60;
        const position = (subtractMinutes * heightByTimeInterval.value) / 60 + spaceFromTop;
        const offset = timelineLayoutRef.current.height / 2;
        goToOffsetY(Math.max(0, position - offset), true);
        verticalListRef.current?.scrollTo({
            y: Math.max(0, position - offset),
            animated: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goToOffsetY, scrollToNow, timelineLayoutRef.current.height, verticalListRef]);

  const _onContentLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (!minTimeIntervalHeight.value) {
      const minHeight = Math.max(
        layout.height / (totalHours + 1),
        DEFAULT_PROPS.MIN_TIME_INTERVAL_HEIGHT
      );
      minTimeIntervalHeight.value = minHeight;
    }

    timelineLayoutRef.current = {
      width: layout.width,
      height: layout.height,
    };
  };

  const { pinchGesture, pinchGestureRef } = useZoomGesture({
    enabled: allowPinchToZoom && !selectedEvent?.id,
  });
  const {
    dragCreateGesture,
    isDraggingCreate,
    dragXPosition,
    dragYPosition,
    currentHour,
    currentDate,
    onLongPress,
    draggingEvent,
    onLongEditEvent,
    setDraggingEvent,
    setIsDraggingCreate,
    gestureEvent,
  } = useDragCreateGesture({
    onDragCreateEnd,
    onDragEditEnd: other.onEndDragSelectedEvent,
  });

  const _onLongPressBackground = (
    date: string,
    event: GestureResponderEvent
  ) => {
    if (allowDragToCreate && !selectedEvent) {
      onLongPress(event);
    }
      onLongPressBackground?.(date, event);
  };

  const _onLongPressEvent = (event: PackedEvent) => {
    // setDraggingEvent(null);
    setIsDraggingCreate(false);
    isDragCreateActive.value = false
    if (allowEventHoldToDragEvent) {
      onLongEditEvent(event);
    }
    if (selectedEvent == undefined) {
      onLongPressEvent?.(event);
    }
  };

  const groupedEvents = useMemo(
    () => groupEventsByDate(events, tzOffset),
    [events, tzOffset]
  );

  useAnimatedReaction(
    () => currentIndex.value,
    (index, prevIndex) => {
      if (!onChange) {
        return;
      }
      const startDate = pages[viewMode].data[index];
      if (startDate) {
        runOnJS(onChange)({
          length: pages[viewMode].data.length,
          index,
          prevIndex,
          date: startDate,
        });
      }
    },
    [viewMode]
  );

  const _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.value = e.nativeEvent.contentOffset.y;
  };

  const _onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollOffsetY = e.nativeEvent.contentOffset.y;
    const scrollHeight = e.nativeEvent.layoutMeasurement.height;

    if(!selectedEvent) {
      return
    }

    const cannotScroll = scrollOffsetY + scrollHeight >= contentHeight
    const MULTIPLIER = 90

    if(cannotScroll) {
      if(DEVICE_HEIGHT > 900) {
        dragYPosition.value = ((selectedEvent.startHour - 16) * MULTIPLIER) + 5
      }
      else if(DEVICE_HEIGHT < 830) {
        dragYPosition.value = ((selectedEvent.startHour - 18) * MULTIPLIER) + 72
      }
      else {
        dragYPosition.value = ((selectedEvent.startHour - 17) * MULTIPLIER) + 13
      }
    }
    else {
      dragYPosition.value += 5
    }

    if(viewMode === 'week') {
      dragXPosition.value = moment.tz(selectedEvent.start, tzOffset).day() * columnWidth
    }
  }

  useEffect(() => {
    if (selectedEvent) { 
      isDragCreateActive.value = true
      setDraggingEvent(selectedEvent)
      currentHour.value = selectedEvent.startHour
    } else {
      dragXPosition.value = 0;
      dragYPosition.value = 0;
      currentHour.value = 0;
      setDraggingEvent(null);
      setIsDraggingCreate(false);
      isDragCreateActive.value = false
      gestureEvent.value = undefined;
    }
  }, [selectedEvent, dragXPosition, dragYPosition, currentHour, setDraggingEvent, setIsDraggingCreate, gestureEvent]);

  const dragCreateItemProps = {
    offsetX: dragXPosition,
    offsetY: dragYPosition,
    currentHour: currentHour,
    currentDate: currentDate,
    event: draggingEvent ?? undefined,
    renderEventContent: other.renderEventContent ?? undefined
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {isShowHeader && (
        <TimelineHeader
          renderDayBarItem={renderDayBarItem}
          onPressDayNum={onPressDayNum}
          isLoading={isLoading}
          highlightDates={highlightDates}
          selectedEventId={selectedEvent?.id}
        />
      )}
      <View style={styles.content} onLayout={_onContentLayout}>
        <GestureDetector gesture={Gesture.Race(dragCreateGesture, pinchGesture)}>
          <AnimatedScrollView
            ref={verticalListRef}
            scrollEventThrottle={16}
            pinchGestureEnabled={false}
            showsVerticalScrollIndicator={false}
            onScroll={_onScroll}
            simultaneousHandlers={pinchGestureRef}
            onMomentumScrollEnd={_onScrollEnd}
          >
            <TimelineSlots
              {...other}
              events={groupedEvents}
              selectedEvent={selectedEvent}
              isDragging={isDraggingCreate}
              isLoading={isLoading}
              onLongPressEvent={_onLongPressEvent}
              onLongPressBackground={_onLongPressBackground}
            />

            <View style={{ height: 45 }} />
          </AnimatedScrollView>
        </GestureDetector>

        {isDraggingCreate && <DragCreateItem {...dragCreateItemProps} />}
      </View>
    </GestureHandlerRootView>
  );
};

export default forwardRef(Timeline);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
});
