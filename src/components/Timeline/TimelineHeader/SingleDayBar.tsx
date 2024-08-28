import moment from 'moment-timezone';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';
import useTimelineScroll from '../../../hooks/useTimelineScroll';

const SingleDayBar = ({
  width,
  startDate,
  theme,
  locale,
  highlightDates,
  onPressDayNum,
  currentDate,
  tzOffset,
}: DayBarItemProps) => {

  const { goToNextPage, goToPrevPage, goToOffsetY } = useTimelineScroll();
  
  const _renderDay = () => {
    const dateByIndex = moment.tz(startDate, tzOffset);
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const [dayNameText, dayNum] = dateByIndex
      .locale(locale)
      .format('dddd, Do')
      .split(',');
    const highlightDate = highlightDates?.[dateStr];

    const { dayName, dayNumber, dayNumberContainer } = getDayBarStyle(
      currentDate,
      dateByIndex,
      theme,
      highlightDate
    );

    return (
      <View style={styles.dayItem}>
        {/* <Text
          allowFontScaling={theme.allowFontScaling}
          style={[styles.dayName, dayName]}
        >
          {dayNameText}
        </Text> */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.dayNumBtn}
        >
          <Text
            allowFontScaling={theme.allowFontScaling}
            style={styles.dayNumber}
          >
            {dayNameText}
            {dayNum}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { width, height: DEFAULT_PROPS.DAY_BAR_HEIGHT },
      ]}
    >
      <TouchableOpacity style={styles.arrow} onPress={() => goToPrevPage(true)}>
        <Image source={require("../../../assets/left_arrow.png")} />
        </TouchableOpacity>
        {_renderDay()}
      <TouchableOpacity style={styles.arrow} onPress={() => goToNextPage(true)}>
      <Image source={require("../../../assets/right_arrow.png")} />
      </TouchableOpacity>
    </View>
  );
};

export default SingleDayBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dayItem: { alignItems: 'center', marginHorizontal: 30},
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 2,
    width: 'auto',
    height: 28,
    padding: 5
  },
  dayName: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 12 },
  dayNumber: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 18 },
  arrow: { padding: 10}
});
