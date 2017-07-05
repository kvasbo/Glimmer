export default class Helpers {

    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    getCalendarTime(time) {

        let m = new moment(time);

        if(new moment().diff(m, "hours") < 7)
        {
            return m.fromNow();
        }
        else
        {
            return m.calendar();
        }

    }

    log() {

    }

    getPersonById(id)
    {
        var tmp = global.store.getState().Krets;
        return tmp.filter((item) => id == item.person.id)
    }

}