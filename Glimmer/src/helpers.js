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

        return new moment(time).calendar();

    }

    logItems = [];

    log() {

        for (var i = 0; i < arguments.length; i++) {
            var out = {};
            out.key = Math.random();
            out.time = new Date();
            out.data = arguments[i];
            this.logItems.push(out);
        }

        this.logItems = this.logItems.slice(0, 500);
    }

}