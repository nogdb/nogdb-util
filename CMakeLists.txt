cmake_minimum_required(VERSION 3.1.3)

project(nogdb-util LANGUAGES CXX)

file(GLOB util_SOURCE src/*.[ch]pp)
file(GLOB server_SOURCE server/*.[ch]pp)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(nogdb_BuildTests OFF CACHE BOOL "disable nogdb testing")
set(JSON_BuildTests OFF CACHE BOOL "disable json testing")
set(BUILD_TESTING OFF CACHE BOOL "disable Simple-Web-Server (and other testing)")

add_subdirectory(nogdb)
add_subdirectory(dep/json)
add_subdirectory(dep/Simple-Web-Server)

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
        ${gtest_LIB}
        nogdb
        nlohmann_json
        simple-web-server
    )
    target_include_directories(runtest_${name} PUBLIC /usr/local/include)
    add_test(
        NAME build_runtest_${name}
        COMMAND "${CMAKE_COMMAND}" --build ${CMAKE_BINARY_DIR} --target runtest_${name}
    )
    add_test(
        NAME test_${name}
        COMMAND runtest_${name}
    )
endfunction()

enable_testing()
find_library(gtest_LIB gtest)
executable_runtest(translator src/translator.cpp)
executable_runtest(server_http_response server/http_response.cpp src/translator.cpp)

