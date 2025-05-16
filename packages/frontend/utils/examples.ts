/**
 * Array containing examples to show in the dropdown.
 */
export default [
    {
        name: 'Syracuse\'s conjecture',
        constraints: ["syracuse(10,0)"],
        variables: [{"constraint": "syracuse", "position": 2, "value": ""}],
        code:
`<chr_constraint> syracuse(?unsigned long int, ?unsigned long int)
stop @ syracuse(1LU, C) <=> C %= 0;;\neven_case @ syracuse(R,C) <=> R % 2 == 0 | syracuse(R / 2,C1), C %= C1 + 1;;
odd_case @ syracuse(R,C) <=> R % 2 == 1 | syracuse(3 * R + 1,C1), C %= C1 + 1;;`,
    },
    {
        name: 'Greatest Common Divisor',
        constraints: ["gcd(12)", "gcd(8)"],
        variables: [],
        code: 
`<chr_constraint> gcd(+unsigned long int), res(?unsigned long int)
gcd1 @ gcd(0ul) <=> success();;
gcd2 @ gcd(N) \\ gcd(M) <=> N <= M | gcd(M % N);;
res  @ gcd(N) \\ res(M) <=> M %= N;;`,
    },
    {
        name: 'Acker',
        constraints: ['acker(2,3, 5)'],
        variables: [{constraint: 'acker', position: 1, value : ''}],
        code:
`<chr_constraint> acker(?int,?int,?int)
		
acker(X, Y, A1) \\ acker(X, Y, A2) <=> A1 %= A2;;
acker(0, Y, A) ==>  A %= Y + 1;;
acker(X, 0, A) ==> acker(X - 1, 1, A);;
acker(X, Y, A) ==> X > 0 and Y > 0 | 
	acker(X, Y - 1, A1),
	acker(X - 1, A1, A);;`        
    },
] as Example[]; 