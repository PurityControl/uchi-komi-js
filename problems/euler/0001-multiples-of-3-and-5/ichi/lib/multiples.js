exports.multiples_to = function(limit) {
    var total = 0;
    for (i = 0; i < limit; i++) {
        if (i % 3 == 0 || i % 5 == 0) {
            total += i;
        }
    }
    return total
};

