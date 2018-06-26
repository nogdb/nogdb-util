cmake_minimum_required(VERSION 3.1.3)

project(nogdb-util LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

file(GLOB nogdb_util_FILE src/*.[ch]pp)
file(GLOB nogdb_server_FILE server/*.[ch]pp)

set(nogdb_BuildTests OFF CACHE BOOL "disable nogdb testing")
set(JSON_BuildTests OFF CACHE BOOL "disable json testing")
set(BUILD_TESTING OFF CACHE BOOL "disable Simple-Web-Server (and other testing)")

add_subdirectory(nogdb)
add_subdirectory(dep/json)
add_subdirectory(dep/Simple-Web-Server)

add_library(nogdb_util_OBJECT EXCLUDE_FROM_ALL OBJECT ${nogdb_util_FILE})
target_include_directories(nogdb_util_OBJECT
    PUBLIC
        $<TARGET_PROPERTY:nogdb,INTERFACE_INCLUDE_DIRECTORIES>
        $<TARGET_PROPERTY:nlohmann_json,INTERFACE_INCLUDE_DIRECTORIES>
)

add_executable(server
    ${nogdb_server_FILE}
    $<TARGET_OBJECTS:nogdb_util_OBJECT>
)
add_dependencies(server nogdb_util_OBJECT)
target_link_libraries(server
    nogdb
    nlohmann_json
    simple-web-server
)

# executable_runtest(name srcs...)
# Create runtest executable.
function(executable_runtest name)
    add_executable(runtest_${name} EXCLUDE_FROM_ALL
        test/main.cpp
        test/test_${name}.cpp
        ${ARGN}
    )
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
executable_runtest(server_http_response server/http_response.cpp server/context.cpp src/translator.cpp)

