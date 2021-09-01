import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class DayView extends Route{

  
  @service('calendar') calendarSvc;


  async beforeModel(){

    try{
      await this.calendarSvc.getAllTimeSlots();
      await this.calendarSvc.getAllOwners();
    }
    catch{
      console.log("there was a problem retrieving timeslot/owner data")
    }
  }


  model(){

    const allTimeSlots = this.store.peekAll("timeslot");
    const allCalendarDates = allTimeSlots.mapBy("date").uniq();
    const sortedCalendarDates = allCalendarDates.sort().reverse();

    return {
      allCalendarDates  : sortedCalendarDates,
    };
  }


  afterModel(model, transition){

    const targetName = transition.targetName;

    if(targetName === 'dashboard.day-view.index'){

      const firstDate = model.allCalendarDates.firstObject;
      this.transitionTo("dashboard.day-view.date", firstDate);
    }
  }
}