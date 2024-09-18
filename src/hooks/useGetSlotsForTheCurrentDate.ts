import { useMemo } from 'react';

import moment from 'moment-timezone';
import { uniqBy, flatten } from "lodash";

import { useTimelineCalendarContext } from '../context/TimelineProvider'
import type { UnavailableHour } from '../types'
import { getDaysOfTheWeek } from '../utils'

export const useGetSlotsForTheCurrentDate = () => {
    const {
        events,
        pages,
        viewMode,
        currentIndex,
        unavailableHours,
        tzOffset
      } = useTimelineCalendarContext();
    
      //prepares the events data structure for easier checking later on
      const slots = useMemo(
        () => {
        let workHours: UnavailableHour[] = []
          const currentDate = pages[viewMode].data[currentIndex.value]
          if(currentDate) {
            const datesToFilter = getDaysOfTheWeek(currentDate)
    
            if(unavailableHours) {          
              if(Array.isArray(unavailableHours)) {
                workHours = unavailableHours.map((workHour: UnavailableHour) => ({ 
                  date: moment(currentDate).format("YYYY-M-D"), 
                  ...workHour,
                }))
              }
              else {
                workHours = flatten(
                  Object.keys(unavailableHours)
                  .map(key => (
                    unavailableHours[key]
                    .map((workHour: UnavailableHour) => ({ 
                      date: moment(datesToFilter[parseInt(key)]).format("YYYY-M-D"), 
                      ...workHour
                    }))
                  ))
                )
              }
            }
    
            const result = events
    
            //only include the slots on the current selected date
            .filter((eventItem) => datesToFilter.includes(moment.tz(eventItem.start, tzOffset).format("YYYY-MM-DD")))
            .flatMap(eventItem => {
    
              const formattedStartDate = moment.tz(eventItem.start, tzOffset).format("YYYY-M-D")
    
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
                    id: eventItem.id,
                    date: formattedStartDate,
                    start: parseFloat(startSplit[0]) + parseFloat(startMinutes),
                    end: parseFloat(endSplit[0]) + parseFloat(endMinutes),
                  }
                })
              })
            })
    
            //remove duplicate slots so there are lesser items to loop when doing checks
            return uniqBy([...result, ...workHours], (slot) => `${slot.date}-${slot.start}-${slot.end}`)
          }
          return workHours
        },
        [events, currentIndex.value, unavailableHours]
      );

        return slots
}