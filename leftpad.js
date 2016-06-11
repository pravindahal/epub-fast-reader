// this module is not written to be cheeky or a smartass
// i actually needed one which takes in a number, and a 
// max number which will appear on the list (so that its
// length can be calculated) 

// pad a number based on the maximum i.e. if max is 123, pad 1 to 001
const pad = (n, max, z) => {
    var width = Math.ceil(Math.log10(max)); // get number of digits
    n = n + ''; //stringify
    z = z || '0'; // default padding string is 0
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

module.exports = pad