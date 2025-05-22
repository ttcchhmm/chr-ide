/**
 * Array containing examples to show in the dropdown.
 */
export default Object.freeze([
    {
        name: 'Towers of Hanoi',
        constraints: ["hanoi(3,'A','C','B')"],
        variables: [],
        code:
`<chr_constraint> hanoi(?int,+char,+char,+char), move(?char,?char)
hanoi(1, Src, Dest, _) <=> move(Src, Dest);;
hanoi(N, Src, Dest, Aux) <=> 
N > 1 |
hanoi(N - 1, Src, Aux, Dest),
move(Src, Dest),
hanoi(N - 1, Aux, Dest, Src);;`,
    },
    {
        name: 'Greatest Common Divisor',
        constraints: ["gcd(12)", "gcd(8)", "res(X)"],
        variables: [{ name: 'X', value: '' }],
        code: 
`<chr_constraint> gcd(+unsigned long int), res(?unsigned long int)
gcd1 @ gcd(0ul) <=> success();;
gcd2 @ gcd(N) \\ gcd(M) <=> N <= M | gcd(M % N);;
res  @ gcd(N) \\ res(M) <=> M %= N;;`,
    },
    {
        name: 'Ackermann function',
        constraints: ['acker(2, 3, X)'],
        variables: [{name: 'X', value: ''}],
        code:
`<chr_constraint> acker(?int,?int,?int)
		
acker(X, Y, A1) \\ acker(X, Y, A2) <=> A1 %= A2;;
acker(0, Y, A) ==>  A %= Y + 1;;
acker(X, 0, A) ==> acker(X - 1, 1, A);;
acker(X, Y, A) ==> X > 0 and Y > 0 | 
	acker(X, Y - 1, A1),
	acker(X - 1, A1, A);;`        
    },
    {
        name: 'N-queens',
        constraints: ['nqueens(8)'],
        variables: [],
        code:
`<chr_constraint> queen(+int,+int), next_queen(+int), nqueens(?int), solve()

nqueens(N) ==> solve();;

solve() <=> next_queen(0);;

row  @ queen(_,R), queen(_,R)     <=> failure();;
diag @ queen(C1,R1), queen(C2,R2) <=> abs(C1-C2) == abs(R1-R2) | failure();;

label_queen1 @ nqueens(N), next_queen(C) <=> *C == N | print(*this), success();;
label_queen2 @ nqueens(N) \\ next_queen(C) <=> exists(r, 0, N-1, (queen(C,r), next_queen(C+1)) ) ;;`
    },
    {
        name: 'Syracuse\'s conjecture',
        constraints: ['syracuse(17, Res)'],
        variables: [{name: 'Res', value: '' }],
        code:
`<chr_constraint> syracuse(?unsigned long int, ?unsigned long int)
stop @ syracuse(1LU, C) <=> C %= 0;;
even_case @ syracuse(R,C) <=> R % 2 == 0 | syracuse(R / 2,C1), C %= C1 + 1;;
odd_case @ syracuse(R,C) <=> R % 2 == 1 | syracuse(3 * R + 1,C1), C %= C1 + 1;;`
    },
]) as readonly Example[]; 