cmake_minimum_required(VERSION 3.1.3)

project(nogdb-util LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(nogdb_BuildTests OFF CACHE BOOL "disable nogdb testing")
set(JSON_BuildTests OFF CACHE BOOL "disable json testing")
set(BUILD_TESTING OFF CACHE BOOL "disable Simple-Web-Server (and other testing)")

add_subdirectory(nogdb)
add_subdirectory(dep/json)
add_subdirectory(dep/Simple-Web-Server)

link_directories(/usr/local/lib)

add_library(nogdb_util_OBJECT EXCLUDE_FROM_ALL OBJECT
    src/translator.cpp
#    src/
)
target_include_directories(nogdb_util_OBJECT
    PUBLIC
        $<TARGET_PROPERTY:nogdb,INTERFACE_INCLUDE_DIRECTORIES>
        $<TARGET_PROPERTY:nlohmann_json,INTERFACE_INCLUDE_DIRECTORIES>
)

add_library(nogdb_util_server_OBJECT EXCLUDE_FROM_ALL OBJECT
    server/context.cpp
    server/http_response.cpp
#    server/
)
target_include_directories(nogdb_util_server_OBJECT
    PUBLIC
        $<TARGET_PROPERTY:nogdb,INTERFACE_INCLUDE_DIRECTORIES>
        $<TARGET_PROPERTY:nlohmann_json,INTERFACE_INCLUDE_DIRECTORIES>
        $<TARGET_PROPERTY:simple-web-server,INTERFACE_INCLUDE_DIRECTORIES>
)

add_executable(server
    server/main.cpp
    $<TARGET_OBJECTS:nogdb_util_OBJECT>
    $<TARGET_OBJECTS:nogdb_util_server_OBJECT>
)
#add_dependencies(server nogdb_util_OBJECT)
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
        $<TARGET_OBJECTS:nogdb_util_OBJECT>
        $<TARGET_OBJECTS:nogdb_util_server_OBJECT>
    )
    target_link_libraries(runtest_${name}
        gtest
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
executable_runtest(translator)
executable_runtest(server_http_response)

add_executable(runtest_all EXCLUDE_FROM_ALL
    test/main.cpp
    test/test_translator.cpp
    test/test_server_http_response.cpp
#    test/
    $<TARGET_OBJECTS:nogdb_util_OBJECT>
    $<TARGET_OBJECTS:nogdb_util_server_OBJECT>
)
target_link_libraries(runtest_all
    gtest
    nogdb
    nlohmann_json
    simple-web-server
)
target_include_directories(runtest_all PUBLIC /usr/local/include)

