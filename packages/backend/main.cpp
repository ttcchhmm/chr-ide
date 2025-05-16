#include <iostream>
#include <chrpp.hh>

template< typename T >
void print(T& space)
{
	auto it = space.chr_store_begin();
	while (!it.at_end())
	{
		std::string s = it.to_string();
		size_t pos = 0;
		while ((pos = s.find(", ", pos)) != std::string::npos) {
			s.replace(pos, 2, ",");
		}
		std::cout << "TRACE [RULES][" << s << "]" << std::endl;
		++it;
	}
}

/* 
<CHR name="CHRPP">


		<chr_constraint> acker(?int,?int,?int)
		
		acker(X, Y, A1) \ acker(X, Y, A2) <=> A1 %= A2;;
		acker(0, Y, A) ==>  A %= Y + 1;;
		acker(X, 0, A) ==> acker(X - 1, 1, A);;
		acker(X, Y, A) ==> X > 0 and Y > 0 | 
							acker(X, Y - 1, A1),
							acker(X - 1, A1, A);;


		
</CHR>
 */

int main() {
	chr::Log::set_output(std::cout);
    TRACE( chr::Log::register_flags(chr::Log::ALL);)
	
	auto space = CHRPP::create();
	//Variables

	CHR_RUN( 
		space->acker(2,3, 5);
	)
	print(*space);

	for (auto& c : space->get_acker_store()){
        std::cout << "TRACE [VAR][acker/1][" << *std::get<1>(c)<<"]"<< std::endl;
    }
    


    chr::Statistics::print(std::cout);
    std::cout << chr::Statistics::to_string() << std::endl;
	return 0;
}
