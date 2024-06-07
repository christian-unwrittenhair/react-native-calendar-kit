import { useRef } from 'react';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming, scrollTo } from 'react-native-reanimated';
import { useTimelineCalendarContext } from '../context/TimelineProvider';
import { clampValues } from '../utils';
import useTimelineScroll from './useTimelineScroll';

const useZoomGesture = ({ enabled }: { enabled: boolean }) => {
  const {
    timeIntervalHeight,
    maxTimeIntervalHeight,
    minTimeIntervalHeight,
    isDragCreateActive,
    offsetY,
    isPinchActive,
    spaceFromTop,
    verticalListRef,
  } = useTimelineCalendarContext();
  const { goToOffsetY } = useTimelineScroll();
  const focalY = useSharedValue(0);
  const startScale = useSharedValue(0);

  const pinchGestureRef = useRef<GestureType>();

  const _handleScrollView = (currentHeight: number, prevHeight: number) => {
    const pinchYNormalized = (focalY.value + offsetY.value + spaceFromTop) / prevHeight;
    const pinchYScale = currentHeight * pinchYNormalized;
    const y = pinchYScale - focalY.value;
    goToOffsetY(y, false);
  };

  useAnimatedReaction(
    () => timeIntervalHeight.value,
    (current, prev) => {
      if (!isPinchActive.value || !prev || current === prev) {
        return;
      }
      runOnJS(_handleScrollView)(current, prev);
    }
  );

  const pinchGesture = Gesture.Pinch()
    .enabled(enabled)
    .onBegin(({ scale }) => {
      isPinchActive.value = true;
      startScale.value = scale;
    })
    .onUpdate(({ focalY, scale, velocity }) => {
      if (isDragCreateActive.value) {
        return;
      }
      const diffScale = startScale.value - scale;
      const newScale = 1 - diffScale;
      const newHeight = newScale * timeIntervalHeight.value;
      const clampedHeight = clampValues(
        newHeight,
        minTimeIntervalHeight.value - 2,
        maxTimeIntervalHeight + 5
      );
      startScale.value = scale;
      focalY = focalY;
      if (newHeight > maxTimeIntervalHeight || newHeight < minTimeIntervalHeight.value || velocity === 0) {
        return;
      }
      timeIntervalHeight.value = clampedHeight;
      const deltaY = offsetY.value + focalY;
      const newOffsetY = offsetY.value - deltaY * (1 - newScale);
      scrollTo(verticalListRef, 0, newOffsetY, false);
    })
    .onEnd(({ focalY }) => {
      const nextHeight = clampValues(
        timeIntervalHeight.value,
        minTimeIntervalHeight.value,
        maxTimeIntervalHeight
      );
      const newScale = nextHeight / timeIntervalHeight.value;
      if (newScale === 1) {
        isPinchActive.value = false;
        return;
      }
      timeIntervalHeight.value = withTiming(nextHeight, { duration: 500 });
      const deltaY = offsetY.value + focalY;
      const newOffsetY = offsetY.value - deltaY * (1 - newScale);
      scrollTo(verticalListRef, 0, newOffsetY, true);
      isPinchActive.value = false;
    })
    .withRef(pinchGestureRef);

  return { pinchGesture, pinchGestureRef };
};

export default useZoomGesture;
