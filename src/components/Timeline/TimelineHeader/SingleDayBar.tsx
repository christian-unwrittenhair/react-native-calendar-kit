import moment from 'moment-timezone';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import useTimelineScroll from '../../../hooks/useTimelineScroll';

const SingleDayBar = ({
  width,
  startDate,
  theme,
  locale,
  tzOffset,
  currentDate
}: DayBarItemProps) => {

  const { goToNextPage, goToPrevPage } = useTimelineScroll();

  
  const _renderDay = () => {
    const dateByIndex = moment.tz(startDate, tzOffset);
    const [dayNameText, dayNum] = dateByIndex
      .locale(locale)
      .format('dddd, Do')
      .split(',');

    const isCurrentDate = currentDate === startDate

    return (
      <View style={[styles.dayItem, isCurrentDate && styles.activeDateContainer ]}>
        <View
          style={styles.dayNumBtn}
        >
          <Text
            allowFontScaling={theme.allowFontScaling}
            style={[
              styles.dayNumber,
              isCurrentDate && styles.activeDateText
            ]}
          >
            {dayNameText}
            {dayNum}
          </Text>
        </View>
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
      <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => goToPrevPage(true)}>
        <Image source={require("../../../assets/left_arrow.png")} />
        </TouchableOpacity>
        {_renderDay()}
      <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => goToNextPage(true)}>
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
  dayItem: { 
    alignItems: 'center',
    paddingHorizontal: 5
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 2,
    width: 'auto',
    height: 28,
    padding: 5,
  },
  activeDateContainer: {
    backgroundColor: "#F06D76",
    borderRadius: 20,
  },
  activeDateText: {
    color: "white"
  },
  dayName: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 12 },
  dayNumber: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 18, lineHeight: 18 },
  arrow: { 
    paddingVertical: 10, 
    width: '20%', 
  },
  arrowLeft: {
    paddingRight: 20,
    alignItems: "flex-end"
  },
  arrowRight: {
    paddingLeft: 20
  }
});
