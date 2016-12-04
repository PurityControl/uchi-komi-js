exports.total_to = function(limit) {
  var total = 0;
  var tmp;
  for (var a = 1, b = 2; a < limit; tmp = a + b, a = b, b = tmp) {
        if (a % 2 == 0 ) {
            total += a;
        }
    }
    return total
};
