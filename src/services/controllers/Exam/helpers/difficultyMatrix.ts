/**
 * GENERATED AS A BINOMIAL EXPANSION TERMS. RUN CODE BELOW TO GEN THIS
 */

// function binomialExpansionValues(n, p) {
//   const terms = [];

//   // Helper function to calculate factorial
//   function factorial(num) {
//     return num <= 1 ? 1 : num * factorial(num - 1);
//   }
//   // Function to calculate binomial coefficient C(n, k)
//   function binomialCoefficient(n, k) {
//     return factorial(n) / (factorial(k) * factorial(n - k));
//   }

//   // Calculate each term's value in the expansion
//   for (let k = 0; k <= n; k++) {
//     const coefficient = binomialCoefficient(n, k);
//     const termValue = coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
//     terms.push(`${k + 1}: ${termValue}`);
//   }

//   return terms.join(", ");
// }

// // Example: Set the values of n and p
// const n = 9;
// const pArr = [0.15, 0.3, 0.5, 0.7, 0.85];
// let str = "{";
// let i = 1;
// for (let p of pArr) {
//   str += `${i}: {${binomialExpansionValues(9, p)}}, `;
//   i++;
// }

// str += "}";
// console.log(str);

export const difficultyWeighting: Record<number, Record<number, number>> = {
  1: {
    1: 0.23161694628320306,
    2: 0.3678622088027343,
    3: 0.25966744150781246,
    4: 0.10692188767968747,
    5: 0.028302852621093746,
    6: 0.004994621050781248,
    7: 0.0005876024765624998,
    8: 0.00004444052343749999,
    9: 0.0000019606113281249995,
    10: 3.844335937499999e-8,
  },
  2: {
    1: 0.04035360699999998,
    2: 0.1556496269999999,
    3: 0.2668279319999999,
    4: 0.2668279319999999,
    5: 0.17153224199999995,
    6: 0.07351381799999997,
    7: 0.02100394799999999,
    8: 0.0038578679999999987,
    9: 0.0004133429999999999,
    10: 0.000019682999999999994,
  },
  3: {
    1: 0.001953125,
    2: 0.017578125,
    3: 0.0703125,
    4: 0.1640625,
    5: 0.24609375,
    6: 0.24609375,
    7: 0.1640625,
    8: 0.0703125,
    9: 0.017578125,
    10: 0.001953125,
  },
  4: {
    1: 0.000019683000000000028,
    2: 0.0004133430000000004,
    3: 0.0038578680000000034,
    4: 0.021003948000000015,
    5: 0.07351381800000002,
    6: 0.17153224200000003,
    7: 0.266827932,
    8: 0.266827932,
    9: 0.15564962699999996,
    10: 0.04035360699999998,
  },
  5: {
    1: 3.8443359375000055e-8,
    2: 0.000001960611328125002,
    3: 0.000044440523437500044,
    4: 0.0005876024765625005,
    5: 0.004994621050781253,
    6: 0.028302852621093763,
    7: 0.10692188767968752,
    8: 0.25966744150781257,
    9: 0.36786220880273435,
    10: 0.23161694628320306,
  },
};
