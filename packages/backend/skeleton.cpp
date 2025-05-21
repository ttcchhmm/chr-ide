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
//Rules
</CHR>
 */

int main() {
	chr::Log::set_output(std::cout);
    TRACE( chr::Log::register_flags(chr::Log::ALL);)
	
	auto space = CHRPP::create();
	//Variables

	CHR_RUN( 
		//Constraints
	)
	print(*space);

	//Store
	//PrintVariables

    chr::Statistics::print(std::cout);
    std::cout << chr::Statistics::to_string() << std::endl;
	
	return 0;
}
