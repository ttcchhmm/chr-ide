/**
 * Array containing examples to show in the dropdown.
 */
export default [
    {
        name: 'Syracuse\'s conjecture',
        code:
`<chr_constraint> syracuse(?unsigned long int, ?unsigned long int)
stop @ syracuse(1LU, C) <=> C %= 0;;\neven_case @ syracuse(R,C) <=> R % 2 == 0 | syracuse(R / 2,C1), C %= C1 + 1;;
odd_case @ syracuse(R,C) <=> R % 2 == 1 | syracuse(3 * R + 1,C1), C %= C1 + 1;;`,
        constraints: ["syracuse(10,0)"],
        variables: [{"constraint": "syracuse", "position": 2, "value": ""}],
    },
    {
        name: 'Greatest Common Divisor',
        code: 
`<chr_constraint> gcd(+unsigned long int), res(?unsigned long int)
gcd1 @ gcd(0ul) <=> success();;
gcd2 @ gcd(N) \ gcd(M) <=> N <= M | gcd(M % N);;
res  @ gcd(N) \ res(M) <=> M %= N;;`,
        constraints: ["gcd(12)", "gcd(8)"],
        variables: [{"constraint" : "res", "position": 1, "value": ""}],
    },
] as Example[]; 