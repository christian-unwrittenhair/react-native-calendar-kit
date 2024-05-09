import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { times } from 'lodash';
import moment from 'moment-timezone';
import { COLUMNS, DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';

export const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: (SCREEN_WIDTH - 88) / 7,
    width: (SCREEN_WIDTH - 88) / 7,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
  },
  dayName: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 10,
  },
  dayNumber: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dotView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 4,
    width: "100%",
  },
});

const Dots = ({ date, highlightDates }: any) => {
  const dotElements = useMemo(() => {
    const count = highlightDates[date]?.count || 0;
    const dotArray = Array.from({ length: Math.min(3, Math.floor(count / 2) + 1) }, (_, i) => (
      <View key={i} style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: count % 2 === 0 ? "#F06D76" : '#56CCF2',
        marginHorizontal: 2,
      }} />
    ));

    return dotArray;
  }, [date, highlightDates]);

  return <View style={styles.dotView}>{dotElements}</View>;
};

const MultipleDayBar = ({
  width,
  columnWidth,
  viewMode,
  startDate,
  onPressDayNum,
  theme,
  locale,
  highlightDates,
  currentDate,
}: DayBarItemProps) => {
  const renderDay = useMemo(() => (dayIndex: number) => {
    const dateByIndex = moment.tz(startDate, currentDate).add(dayIndex, 'days');
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const [dayNameText, dayNum] = dateByIndex.locale(locale).format('dd,D').split(',');

    const { dayName, dayNumber, dayNumberContainer } = getDayBarStyle(currentDate, dateByIndex, theme);

    return (
      <View key={dateStr} style={[styles.dayItem, { width: columnWidth }]}>
        <TouchableOpacity
          activeOpacity={1}
          disabled={!onPressDayNum}
          onPress={() => onPressDayNum?.(dateStr)}
          style={[styles.dayNumBtn, dayNumberContainer]}
        >
          <Text allowFontScaling={theme.allowFontScaling} style={[styles.dayName, dayName]}>
            {dayNameText}
          </Text>
          <Text allowFontScaling={theme.allowFontScaling} style={[styles.dayNumber, dayNumber]}>
            {dayNum}
          </Text>
          <Dots date={dateStr} highlightDates={highlightDates} />
        </TouchableOpacity>
      </View>
    );
  }, [startDate, viewMode, columnWidth, onPressDayNum, theme, locale, highlightDates, currentDate]);

  return (
    <View style={[styles.container, { width }]}>
      {times(COLUMNS[viewMode], renderDay)}
    </View>
  );
};

export default MultipleDayBar;
