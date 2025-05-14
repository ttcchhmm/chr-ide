#include <iostream>
#include <chrpp.hh>


/* 
<CHR name="CHRPP">
//Rules
</CHR>
 */

int main() {
	chr::Log::register_flags(chr::Log::ALL);

	auto space = CHRPP::create();
	chr::Logical_var< unsigned long int > Res;

	CHR_RUN(
		space->syracuse(23,Res);
	)

	chr::Statistics::print(std::cout);
	std::cout << chr::Statistics::to_string() << std::endl;

	return 0;
}
