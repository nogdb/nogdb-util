/*
 *  Copyright (C) 2018, Throughwave (Thailand) Co., Ltd.
 *
 *  This file is part of nogdb-util, the NogDB Utility in C++.
 *
 *  nogdb-util is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <gtest/gtest.h>

/**
 * == Invoking the Tests
 *
 * `TEST()` and `TEST_F()` implicitly register their tests with Google Test.
 * So, unlike with many other C++ testing frameworks, you don't have to re-list 
 * all your defined tests in order to run them.
 *
 * After defining your tests, you can run them with `RUN_ALL_TESTS()`,
 * which returns `0` if all the tests are successful, or `1` otherwise.
 * Note that `RUN_ALL_TESTS()` runs all tests in your link unit -- they can be 
 * from different test cases, or even different source files.
 *
 * When invoked, the `RUN_ALL_TESTS()` macro:
 * 1. Saves the state of all Google Test flags.
 * 2. Creates a test fixture object for the first test.
 * 3. Initializes it via `SetUp()`.
 * 4. Runs the test on the fixture object.
 * 5. Cleans up the fixture via `TearDown()`.
 * 6. Deletes the fixture.
 * 7. Restores the state of all Google Test flags.
 * 8. Repeats the above steps for the next test, until all tests have run.
 *
 * In addition, if the test fixture's constructor generates a fatal failure
 * in step 2, there is no point for step 3 - 5 and they are thus skipped. Similarly,
 * if step 3 generates a fatal failure, step 4 will be skipped.
 *
 * Important: You must not ignore the return value of `RUN_ALL_TESTS()`,
 * or `gcc` will give you a compiler error. The rationale for this design is that
 * the automated testing service determines whether a test has passed based on
 * its exit code, not on its stdout/stderr output; thus your `main()` function
 * must return the value of `RUN_ALL_TESTS()`.
 *
 * Also, you should call `RUN_ALL_TESTS()` only once. Calling it more than once
 * conflicts with some advanced Google Test features (e.g. thread-safe death tests)
 * and thus is not supported.
 *
 * The `::testing::InitGoogleTest()` function parses the command line for 
 * Google Test flags, and removes all recognized flags. This allows the user to
 * control a test program's behavior via various flags, which we'll cover in 
 * AdvancedGuide<https://github.com/google/googletest/blob/master/googletest/docs/advanced.md>. 
 * You must call this function before calling `RUN_ALL_TESTS()`, or the flags
 * won't be properly initialized.
 */

int main(int argc, char **argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

