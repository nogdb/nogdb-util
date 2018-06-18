cmake_minimum_required(VERSION 3.1.3)

project(nogdb-util LANGUAGES CXX)

file(GLOB util_SOURCE src/*.[ch]pp)
file(GLOB server_SOURCE server/*.[ch]pp)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(JSON_BuildTests OFF)

add_subdirectory(nogdb)
add_subdirectory(dep/json)

# executable_runtest(name srcs...)
# Create runtest executable.
function(executable_runtest name)
    add_executable(runtest_${name} EXCLUDE_FROM_ALL
        test/main.cpp
        test/test_${name}.cpp
        ${ARGN}
    )
    link_directories(/usr/local/lib)
    target_link_libraries(runtest_${name}
        gtest
        nogdb
        nlohmann_json
    )
    target_include_directories(runtest_${name} PUBLIC /usr/local/include)
endfunction()

executable_runtest(translator src/translator.cpp)

