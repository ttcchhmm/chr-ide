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
		std::cout << "TRACE [PROGRAM][" << s << "]" << std::endl;
		++it;
	}
}

/* 
<CHR name="CHRPP">
//Rules
</CHR>
 */

int main() {
    TRACE( chr::Log::register_flags(chr::Log::ALL);)
	auto space = CHRPP::create();
	//Variables

	CHR_RUN( 
		//Constraints
	)
	print(*space);

	//Store
	// get_XXXX_store()
	for (auto& c : space->get_acker_store()){
        std::cout << "TRACE [VAR][" << *std::get<1>(c)<<"]"<< std::endl;

	}
    chr::Statistics::print(std::cout);
    std::cout << chr::Statistics::to_string() << std::endl;
	return 0;
}
