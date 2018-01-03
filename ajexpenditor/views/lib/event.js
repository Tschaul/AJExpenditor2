exports.getAllOccurences = function (event) {

    var occurences = [event.date];

    if (event.repeats === 'monthly') {

        var currentDate = new Date(event.date);
        var endDate = new Date(event.repeatsUntil)

        while (currentDate <= endDate) {

            currentDate.setMonth(currentDate.getMonth() + 1);

            var key = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

            occurences.push(key);

        }

    }

    return occurences;

}