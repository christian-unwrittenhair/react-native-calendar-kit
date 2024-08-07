import React, { forwardRef } from 'react';
import { Timeline } from './components';
import TimelineProvider from './context/TimelineProvider';
import type { TimelineCalendarHandle, TimelineCalendarProps } from './types';

const TimelineCalendar: React.ForwardRefRenderFunction<
  TimelineCalendarHandle,
  TimelineCalendarProps
> = (
  {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    onPressBackground,
    onPressOutBackground,
    onDateChanged,
    isLoading,
    holidays,
    onLongPressEvent,
    onPressEvent,
    renderEventContent,
    selectedEvent,
    onEndDragSelectedEvent,
    renderCustomUnavailableItem,
    highlightDates,
    onChange,
    editEventGestureEnabled,
    renderSelectedEventContent,
    EditIndicatorComponent,
    renderHalfLineCustom,
    halfLineContainerStyle,
    onTimeIntervalHeightChange,
    onPressEventService,
    onPressTimeHours,
    ...timelineProviderProps
  },
  ref
) => {
  const timelineProps = {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    onPressBackground,
    onPressOutBackground,
    onDateChanged,
    isLoading,
    holidays,
    events: timelineProviderProps.events,
    onLongPressEvent,
    onPressEvent,
    renderEventContent,
    selectedEvent,
    onEndDragSelectedEvent,
    renderCustomUnavailableItem,
    highlightDates,
    onChange,
    editEventGestureEnabled,
    renderSelectedEventContent,
    EditIndicatorComponent,
    renderHalfLineCustom,
    halfLineContainerStyle,
    onTimeIntervalHeightChange,
    onPressEventService,
    onPressTimeHours
  };

  return (
    <TimelineProvider {...timelineProviderProps}>
      <Timeline {...timelineProps} ref={ref} />
    </TimelineProvider>
  );
};

export default forwardRef(TimelineCalendar);
