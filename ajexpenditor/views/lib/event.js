exports.getAllOccurences = function (event) {

    var occurences = [event.date];

    if (event.repeats === 'monthly') {

        var currentDate = new Date(event.date);
        var endDate = new Date(event.repeatsUntil)

        while (currentDate <= endDate) {

            var nextMonth = currentDate.getMonth() + 1

            currentDate.setMonth(nextMonth);

            var key = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

            occurences.push(key);

        }

    }

    return occurences;

}