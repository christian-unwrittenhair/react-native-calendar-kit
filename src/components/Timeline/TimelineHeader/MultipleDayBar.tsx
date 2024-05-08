import times from 'lodash/times';
import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import { COLUMNS, DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';


export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

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
  tzOffset,
}: DayBarItemProps) => {
  const _renderDay = (dayIndex: number) => {
    const dateByIndex = moment.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const [dayNameText, dayNum] = dateByIndex
      .locale(locale)
      .format('dd,D')
      .split(',');
    // const highlightDate = highlightDates?.[dateStr];
    

    const { dayName, dayNumber, dayNumberContainer } = getDayBarStyle(
      currentDate,
      dateByIndex,
      theme,
      // highlightDate
    );

	const Dots = ({ date }) => {
    let obj = {};
		highlightDates.map((i) => {
			obj = {
				...obj,
				[i.date]: i.count,
			};
		});
		const count = obj[`${date}`];
		const overlapArr = (() => {
			if (count === null || count === undefined) {
				return [];
			} else if (count >= 1 && count <= 2) {
				return [1];
			} else if (count >= 3 && count <= 5) {
				return [1, 2];
			} else {
				return [1, 2, 3];
			}
		})();
		const getColor = (count, index) => {
			switch (count) {
				case 0:
					return "#F06D76"
				case 1:
					return '#56CCF2';
				default:
					return index % 2 === 0 ? "#F06D76" : '#56CCF2';
			}
		};
		return (
			<View style={styles.dotView}>
				{overlapArr?.map((ele, index) => (
					<View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: getColor(count, index), marginHorizontal: index === highlightDates?.length - 1 || index === 4 ? 0 : 2, }} />
				))}
			</View>
		);
	};

    return (
      <View
        key={`${startDate}_${dayIndex}`}
        style={[styles.dayItem, { width: columnWidth }]}
      >
        
        <TouchableOpacity
          activeOpacity={1}
          disabled={!onPressDayNum}
          onPress={() => onPressDayNum?.(dateStr)}
          style={[styles.dayNumBtn, dayNumberContainer]}
        >
          <Text
          allowFontScaling={theme.allowFontScaling}
          style={[styles.dayName, dayName]}
        >
          {dayNameText}
        </Text>
          <Text
            allowFontScaling={theme.allowFontScaling}
            style={[styles.dayNumber, dayNumber]}
          >
            {dayNum}
          </Text>
          <Dots date={dateStr} />
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
      {times(COLUMNS[viewMode]).map(_renderDay)}
    </View>
  );
};

export default MultipleDayBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayItem: { alignItems: 'center' },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: (SCREEN_WIDTH - 88) / 7,
    width: (SCREEN_WIDTH - 88) / 7,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
  },
  dayName: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 10 },
  dayNumber: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 14, fontWeight: 'bold' },
  dotView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 4,
    width: "100%",
  },
});
