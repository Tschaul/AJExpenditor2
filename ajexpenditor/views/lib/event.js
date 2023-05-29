exports.getAllOccurences = function (event) {

    var occurences = [];

    if (event.repeats === 'monthly') {

        var currentDate = new Date(event.date);
        var endDate = new Date(event.repeatsUntil)
        var key = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

        while (currentDate <= endDate) {

            occurences.push(key);

            currentDate.setMonth(currentDate.getMonth() + 1);

            key = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

        }

    } else {
        occurences.push(event.date)
    }

    return occurences;

}